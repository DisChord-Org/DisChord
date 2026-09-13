import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
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
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type !== DisChordTokenType.EVENTO) return;

            const eventNode = current as EventNode;
            if (!eventsMap[eventNode.name]) throw new DisChordError({
                phase: ErrorLevel.Analysis,
                message: `El evento '${eventNode.name}' no existe`,
                location: eventNode.location
            }).format();
        }));
    }
}
