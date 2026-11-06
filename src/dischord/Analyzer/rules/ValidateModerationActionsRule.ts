import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { TypeInferrer } from "../../../chord/Analyzer/TypeInferrer";
import { ArrayDataType, PrimitiveDataType, TupleDataType, UnionDataType } from "../../../chord/model/DataType";
import { LiteralNode, TokenType } from "../../../chord/model/types";
import { BanDeleteMessageSeconds, CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode, ModerationAction, ModerationActionNode, ModerationActionObject, ModerationProperty } from "../../types";
import { ModerationActionSchemas } from "../../Generator/constants/schemas";
import { CommandGuildSource, EventSelfTriggers, eventGuildSource } from "../../Generator/constants/mappings";

/**
 * Validates every `banear miembro`, `desbanear usuario` and `expulsar miembro` block, and settles what the
 * generator could not work out on its own. They all change the server, so all the preventive barriers apply:
 *
 *  - The block against the schema of its action (the one `ModerationActionVisitor` resolves it with).
 *  - That it sits inside a command or an event: the call needs the `cliente` and, by default, the
 *    server of that context, which a function or the top level does not have.
 *  - No moderation action inside a loop (banning or kicking in series is a mass ban), and none in the
 *    event that would set it off again (`EventSelfTriggers`).
 *  - That `usuario` is something that can name a user: a user, a text (an id) or a promise of one. A
 *    number, a boolean or a list is rejected when its type is known.
 *  - That `borrarMensajes`, when it is a literal, is a whole number of seconds Discord accepts. The
 *    runtime checks it again, since it may come from a variable.
 *  - The server of the context, written on the node as `guild`.
 */
export class ValidateModerationActionsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = this.createBDOValidator();

    private readonly typeInferrer = new TypeInferrer<DisChordNodeType, DisChordNode>(this.context);

    /** The command or event enclosing the node being visited, innermost last. */
    private readonly enclosing: (CommandNode | EventNode)[] = [];

    /** How many loops enclose the node being visited. */
    private loops = 0;

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walkScoped(nodes, current => {
                if (current.type === DisChordTokenType.CREAR_COMANDO || current.type === DisChordTokenType.EVENTO) {
                    this.enclosing.push(current as CommandNode | EventNode);
                }

                if (current.type === TokenType.BUCLE) this.loops++;
                if (current.type === DisChordTokenType.ACCION_MODERACION) this.validate(current as ModerationActionNode);
            },
            current => {
                if (current.type === DisChordTokenType.CREAR_COMANDO || current.type === DisChordTokenType.EVENTO) {
                    this.enclosing.pop();
                }

                if (current.type === TokenType.BUCLE) this.loops--;
            }
        );
    }

    /**
     * @private
     */
    private validate (node: ModerationActionNode): void {
        this.validator.validate(node.object, ModerationActionSchemas[node.action]);

        const name = `${node.action} ${ModerationActionObject[node.action]}`;
        const context = this.enclosing[this.enclosing.length - 1];

        if (!context) this.fail(
            `'${name}' solo puede usarse dentro de un comando o un evento: necesita el cliente y el servidor de su contexto`,
            node.location
        );

        if (this.loops > 0) this.fail(
            `'${name}' no puede usarse dentro de un bucle: moderar en serie es el patrón de un baneo o una expulsión masivos`,
            node.location
        );

        this.assertNotSelfTriggering(context, node, name);
        this.assertUserCanBeNamed(node, name);

        if (node.action === ModerationAction.Banear) this.assertDeleteSeconds(node);

        node.guild = context.type === DisChordTokenType.CREAR_COMANDO ? CommandGuildSource : eventGuildSource((context as EventNode).name);

        if (!node.object.blocks[ModerationProperty.Servidor] && node.guild === undefined) this.fail(
            `El evento '${(context as EventNode).name}' no trae un servidor: indica 'servidor' en '${name}'`,
            node.location
        );
    }

    /**
     * An event that performs the action that undoes (or repeats) what set it off would run again for its own effect.
     * @private
     */
    private assertNotSelfTriggering (context: CommandNode | EventNode, node: ModerationActionNode, name: string): void {
        if (context.type !== DisChordTokenType.EVENTO) return;

        const event = (context as EventNode).name;

        if (EventSelfTriggers[event]?.includes(node.action)) this.fail(
            `'${name}' dentro del evento '${event}' lo dispararía a sí mismo una y otra vez`,
            node.location
        );
    }

    /**
     * `usuario` is a user, an id or a promise of one; what is known not to be any of them is an error.
     * @private
     */
    private assertUserCanBeNamed (node: ModerationActionNode, name: string): void {
        const value = node.object.blocks[ModerationProperty.Usuario];
        const type = value && this.typeInferrer.infer(value);

        if (type && this.cannotNameAUser(type)) this.fail(
            `En '${name}', '${ModerationProperty.Usuario}' debe ser un usuario, un texto con su identificador o una promesa de uno, no ${type.format()}.`,
            node.location
        );
    }

    private cannotNameAUser (type: unknown): boolean {
        if (type instanceof UnionDataType) return type.members.every(member => this.cannotNameAUser(member));
        if (type instanceof ArrayDataType || type instanceof TupleDataType) return true;

        return type instanceof PrimitiveDataType && type.name !== PrimitiveDataType.Texto.name;
    }

    /**
     * @private
     */
    private assertDeleteSeconds (node: ModerationActionNode): void {
        const value = node.object.blocks[ModerationProperty.BorrarMensajes];
        if (value?.type !== TokenType.LITERAL) return;

        const seconds = (value as LiteralNode<DisChordNodeType>).value;
        const valid = typeof seconds === 'number' && Number.isInteger(seconds) && seconds >= BanDeleteMessageSeconds.Min && seconds <= BanDeleteMessageSeconds.Max;

        if (!valid) this.fail(
            `En 'banear miembro', '${ModerationProperty.BorrarMensajes}' son los segundos de mensajes a borrar: un número entero de ${BanDeleteMessageSeconds.Min} a ${BanDeleteMessageSeconds.Max}.`,
            node.location
        );
    }
}
