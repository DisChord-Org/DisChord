import { ResolveAwaitedCallsRule } from "../../../chord/Analyzer/rules/ResolveAwaitedCallsRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";

/**
 * Chord's `ResolveAwaitedCallsRule` plus dischord's own awaiting construct: `enviar mensaje` is
 * emitted as an `await`, so it follows the rule an awaited call does — fine in a command, an
 * event, an `@asincrono` function or at the top level, an error anywhere else.
 */
export class DisChordResolveAwaitedCallsRule extends ResolveAwaitedCallsRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    protected override awaitingConstruct (node: DisChordASTNode): string | undefined {
        return node.type === DisChordTokenType.CREAR_MENSAJE
            ? "'enviar mensaje' espera una respuesta y solo puede usarse en un comando, un evento, una función @asincrono o a nivel superior"
            : undefined;
    }
}
