import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { fieldKeys } from "../../../chord/BDOSchema";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { ChannelAction, ChannelActionNode, ChannelProperty, CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../types";
import { ChannelActionSchemas } from "../../Generator/constants/schemas";
import { CommandGuildSource, EventGuildSources, eventsMap } from "../../Generator/constants/mappings";

/**
 * Validates every `crear canal`, `editar canal` and `borrar canal` block, and settles what the
 * generator could not work out on its own:
 *
 *  - The block against the schema of its action (the one `ChannelActionVisitor` resolves it with).
 *  - That it sits inside a command or an event: the call needs the `cliente` and, by default, the
 *    server of that context, which a function or the top level does not have.
 *  - That `editar canal` changes something.
 *  - The server `crear canal` defaults to when it names none, written on the node as `guild`: the
 *    command's own, or the one carried by the event's first parameter that has one.
 */
export class ValidateChannelActionsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /** The command or event enclosing the node being visited, innermost last. */
    private readonly enclosing: (CommandNode | EventNode)[] = [];

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(
            node,
            current => {
                if (current.type === DisChordTokenType.CREAR_COMANDO || current.type === DisChordTokenType.EVENTO) {
                    this.enclosing.push(current as CommandNode | EventNode);
                }

                if (current.type === DisChordTokenType.ACCION_CANAL) this.validate(current as ChannelActionNode);
            },
            current => {
                if (current.type === DisChordTokenType.CREAR_COMANDO || current.type === DisChordTokenType.EVENTO) {
                    this.enclosing.pop();
                }
            }
        ));
    }

    /**
     * @private
     */
    private validate (node: ChannelActionNode): void {
        const schema = ChannelActionSchemas[node.action];
        this.validator.validate(node.object, schema);

        const context = this.enclosing[this.enclosing.length - 1];

        if (!context) this.fail(
            `'${node.action} canal' solo puede usarse dentro de un comando o un evento: necesita el cliente y el servidor de su contexto`,
            node.location
        );

        if (node.action === ChannelAction.Editar) this.assertChangesSomething(node);
        if (node.action === ChannelAction.Crear && !node.object.blocks[ChannelProperty.Servidor]) node.guild = this.guildOf(context, node);
    }

    /**
     * `editar canal` with only its target and a reason sends an empty body.
     * @private
     */
    private assertChangesSomething (node: ChannelActionNode): void {
        const changes = ChannelActionSchemas[node.action].fields
            .filter(field => field.output !== undefined)
            .flatMap(field => fieldKeys(field.key));

        if (!changes.some(key => node.object.blocks[key])) this.fail(
            `'editar canal' necesita al menos una propiedad que cambiar: ${changes.join(' / ')}.`,
            node.location
        );
    }

    /**
     * The server `crear canal` defaults to inside `context`.
     * @private
     */
    private guildOf (context: CommandNode | EventNode, node: ChannelActionNode): string {
        if (context.type === DisChordTokenType.CREAR_COMANDO) return CommandGuildSource;

        const event = eventsMap[(context as EventNode).name];
        const source = event?.params.find(param => EventGuildSources[param] !== undefined);

        if (source === undefined) this.fail(
            `El evento '${(context as EventNode).name}' no trae un servidor: indica 'servidor' en 'crear canal'`,
            node.location
        );

        return EventGuildSources[source];
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location });
    }
}
