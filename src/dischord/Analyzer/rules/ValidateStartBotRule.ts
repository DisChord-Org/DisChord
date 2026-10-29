import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, StartBotNode } from "../../types";
import { StartBotSchema } from "../../Generator/constants/schemas";

/**
 * Validates `encender bot { ... }` against {@link StartBotSchema}. Moved out of `ClientInitVisitor`,
 * which used to discover the same problems mid-generation — see `ValidateCallTargetsRule` for the
 * full rationale behind the split.
 */
export class ValidateStartBotRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = this.createBDOValidator();

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
            if (current.type === DisChordTokenType.ENCENDER_BOT) this.validator.validate((current as StartBotNode).object, StartBotSchema);
        });
    }
}
