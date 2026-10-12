import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, MessageNode } from "../../types";
import { MessageSchema } from "../../Generator/constants/schemas";

/**
 * Validates every `enviar mensaje { ... }` block against {@link MessageSchema} — the schema
 * `MessageVisitor` resolves it with. Its own properties are all optional, so what this catches is
 * a property the block does not take (`contnido`): without the check it would be ignored and the
 * message sent empty. `boton` and `embed` are the schema's pass-through keys, validated by the
 * rules of their own.
 */
export class ValidateMessagesRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.CREAR_MENSAJE) this.validator.validate((current as MessageNode).object, MessageSchema);
        }));
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location });
    }
}
