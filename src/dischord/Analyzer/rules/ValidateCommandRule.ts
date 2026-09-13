import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { CommandSchema } from "../../Generator/constants/schemas";

/**
 * Validates a `comando`'s own properties against {@link CommandSchema} — the same schema
 * `CommandVisitor`/`CommandOptionVisitor` read to generate its flags and options. Moved out of
 * those visitors, which used to discover the same problems mid-generation — see
 * `ValidateCallTargetsRule` for the full rationale behind the split.
 */
export class ValidateCommandRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        const validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.CREAR_COMANDO) validator.validate((current as CommandNode).body, CommandSchema);
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
