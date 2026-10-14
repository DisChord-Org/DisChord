import { ResolveAwaitedCallsRule } from "../../../chord/Analyzer/rules/ResolveAwaitedCallsRule";
import { ChannelActionObject, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";

/**
 * Chord's `ResolveAwaitedCallsRule` plus dischord's own awaiting construct: `enviar mensaje` is
 * emitted as an `await`, so it follows the rule an awaited call does — fine in a command, an
 * event, an `@asincrono` function or at the top level, an error anywhere else. The same goes for
 * the channel actions (`crear canal`, `editar canal`, `borrar canal`), emitted as an `await` too.
 */
export class DisChordResolveAwaitedCallsRule extends ResolveAwaitedCallsRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    protected override awaitingConstruct (node: DisChordASTNode): string | undefined {
        if (node.type === DisChordTokenType.CREAR_MENSAJE) {
            return "'enviar mensaje' espera una respuesta y solo puede usarse en un comando, un evento, una función @asincrono o a nivel superior";
        }

        if (node.type === DisChordTokenType.ACCION_CANAL) {
            return `'${node.action} ${ChannelActionObject[node.action]}' espera una respuesta y solo puede usarse en un comando, un evento, una función @asincrono o a nivel superior`;
        }

        return undefined;
    }
}
