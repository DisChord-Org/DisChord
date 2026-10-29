import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { fieldKeys } from "../../../chord/BDOSchema";
import { TokenType } from "../../../chord/model/types";
import { ChannelAction, ChannelActionNode, ChannelActionObject, ChannelProperty, ChannelWriteActions, CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../types";
import { ChannelActionSchemas } from "../../Generator/constants/schemas";
import { CommandGuildSource, EventGuildSources, EventSelfTriggers, eventsMap } from "../../Generator/constants/mappings";

/**
 * Validates every `crear canal`, `editar canal` and `borrar canal` block, and settles what the
 * generator could not work out on its own:
 *
 *  - The block against the schema of its action (the one `ChannelActionVisitor` resolves it with).
 *  - That it sits inside a command or an event: the call needs the `cliente` and, by default, the
 *    server of that context, which a function or the top level does not have.
 *  - The preventive barriers, for the actions that change the server: no channel action inside a loop (a mass creation or deletion), and
 *    none in the event it triggers itself (`crear canal` in `canalCreado` would create channels
 *    forever).
 *  - That `editar canal` changes something.
 *  - The server of the context, written on the node as `guild`: the command's own, or the one
 *    carried by the event's first parameter that has one. `crear canal` without `servidor` needs
 *    it; the other two use it to check that the channel belongs to that server.
 */
export class ValidateChannelActionsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = this.createBDOValidator();

    /** The command or event enclosing the node being visited, innermost last. */
    private readonly enclosing: (CommandNode | EventNode)[] = [];

    /** How many loops enclose the node being visited. */
    private loops = 0;

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
                if (current.type === DisChordTokenType.CREAR_COMANDO || current.type === DisChordTokenType.EVENTO) {
                    this.enclosing.push(current as CommandNode | EventNode);
                }

                if (current.type === TokenType.BUCLE) this.loops++;
                if (current.type === DisChordTokenType.ACCION_CANAL) this.validate(current as ChannelActionNode);
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
    private validate (node: ChannelActionNode): void {
        const schema = ChannelActionSchemas[node.action];
        this.validator.validate(node.object, schema);

        const context = this.enclosing[this.enclosing.length - 1];

        const name = `${node.action} ${ChannelActionObject[node.action]}`;

        if (!context) this.fail(
            `'${name}' solo puede usarse dentro de un comando o un evento: necesita el cliente y el servidor de su contexto`,
            node.location
        );

        // the barriers are for what changes the server; reading in a loop only costs requests
        if (ChannelWriteActions.includes(node.action)) {
            if (this.loops > 0) this.fail(
                `'${name}' no puede usarse dentro de un bucle: crear, editar o borrar canales en serie es el patrón de un borrado o una creación masivos`,
                node.location
            );

            this.assertNotSelfTriggering(context, node);
        }

        if (node.action === ChannelAction.Editar) this.assertChangesSomething(node);

        node.guild = this.guildOf(context);

        const needsOwnServer = node.action === ChannelAction.Crear || node.action === ChannelAction.Listar;

        if (needsOwnServer && !node.object.blocks[ChannelProperty.Servidor] && node.guild === undefined) this.fail(
            `El evento '${(context as EventNode).name}' no trae un servidor: indica 'servidor' en '${name}'`,
            node.location
        );
    }

    /**
     * An event that performs the action which triggers it would run again for its own effect.
     * @private
     */
    private assertNotSelfTriggering (context: CommandNode | EventNode, node: ChannelActionNode): void {
        if (context.type !== DisChordTokenType.EVENTO) return;

        const event = (context as EventNode).name;

        if (EventSelfTriggers[event] === node.action) this.fail(
            `'${node.action} canal' dentro del evento '${event}' lo dispararía a sí mismo una y otra vez`,
            node.location
        );
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
     * The server of `context`, or `undefined` when it carries none.
     * @private
     */
    private guildOf (context: CommandNode | EventNode): string | undefined {
        if (context.type === DisChordTokenType.CREAR_COMANDO) return CommandGuildSource;

        const event = eventsMap[(context as EventNode).name];
        const source = event?.params.find(param => EventGuildSources[param] !== undefined);

        return source === undefined ? undefined : EventGuildSources[source];
    }
}
