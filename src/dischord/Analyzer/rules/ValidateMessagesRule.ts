import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, MessageNode } from "../../types";
import { MessageSchema } from "../../Generator/constants/schemas";

/**
 * Validates every `enviar mensaje { ... }` block:
 *
 *  - Against {@link MessageSchema}, the schema `MessageVisitor` resolves it with. Its own
 *    properties are all optional, so what this catches is a property the block does not take
 *    (`contnido`): without the check it would be ignored and the message sent empty. `boton` and
 *    `embed` are the schema's pass-through keys, validated by the rules of their own.
 *  - That it sits inside a command or an event. The generated call uses the `ctx` those two
 *    declare (the client and the context to reply in), which a function or the top level does not
 *    have: it would fail with a `ReferenceError` when run.
 */
export class ValidateMessagesRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /** How many commands or events enclose the node being visited. */
    private enclosing = 0;

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(
            node,
            current => {
                if (this.opensContext(current)) this.enclosing++;
                if (current.type === DisChordTokenType.CREAR_MENSAJE) this.validate(current as MessageNode);
            },
            current => {
                if (this.opensContext(current)) this.enclosing--;
            }
        ));
    }

    /**
     * Whether a node is a command or an event, the two places that declare `ctx`.
     * @private
     */
    private opensContext (node: DisChordASTNode): boolean {
        return node.type === DisChordTokenType.CREAR_COMANDO || node.type === DisChordTokenType.EVENTO;
    }

    /**
     * @private
     */
    private validate (node: MessageNode): void {
        this.validator.validate(node.object, MessageSchema);

        if (this.enclosing === 0) this.fail(
            "'enviar mensaje' solo puede usarse dentro de un comando o un evento: necesita el cliente y el contexto donde responder",
            node.location
        );
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location });
    }
}
