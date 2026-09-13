import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, StartBotNode } from "../../types";
import { StartBotSchema } from "../../Generator/constants/schemas";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Validates `encender bot { ... }` against {@link StartBotSchema}. Moved out of `ClientInitVisitor`,
 * which used to discover the same problems mid-generation — see `ValidateCallTargetsRule` for the
 * full rationale behind the split.
 */
export class ValidateStartBotRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.ENCENDER_BOT) this.validator.validate((current as StartBotNode).object, StartBotSchema);
        }));
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location }).format();
    }
}
