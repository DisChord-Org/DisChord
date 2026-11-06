import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../types";
import { eventsMap, RenamedEvents } from "../../Generator/constants/mappings";

/**
 * Validates that an `evento <nombre>` names an event `eventsMap` recognizes.
 */
export class ValidateEventRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
            if (current.type !== DisChordTokenType.EVENTO) return;

            const eventNode = current as EventNode;
            if (eventsMap[eventNode.name]) return;

            const renamed = RenamedEvents[eventNode.name];

            this.failAt(eventNode, renamed ? `El evento '${eventNode.name}' ahora se llama '${renamed}'.` : `El evento '${eventNode.name}' no existe`);
        });
    }
}
