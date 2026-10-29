import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../types";
import { eventsMap } from "../../Generator/constants/mappings";

/**
 * Validates that an `evento <nombre>` names an event `eventsMap` recognizes. Moved out of
 * `EventVisitor`, which used to discover the same problem mid-generation — see
 * `ValidateCallTargetsRule` for the full rationale behind the split.
 */
export class ValidateEventRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
            if (current.type !== DisChordTokenType.EVENTO) return;

            const eventNode = current as EventNode;
            if (!eventsMap[eventNode.name]) this.failAt(eventNode, `El evento '${eventNode.name}' no existe`);
        });
    }
}
