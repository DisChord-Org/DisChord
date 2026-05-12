import { Parser } from "../../parser";
import { ASTNode, BinaryExpressionNode, NoUnaryNode, UnaryNode } from "../../../types";
import { SubParser } from "../../subparser";
import { PrimaryParser } from "../PrimaryParser/PrimaryParser";

export class UnaryParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Entry point for the SubParser.
     * Consumes the unary operators.
     */
    public parse(): ASTNode<T, N> {
        const token = this.peek();

        if (token.type === 'NO') {
            this.consume('NO');
            const argument = this.parse();
            return this.createNode<NoUnaryNode<T, N>>({
                type: 'NoUnario',
                operator: 'NO',
                object: argument
            });
        }

        if (token.type === 'TIPO') {
            this.consume('TIPO');
            const argument = this.parse();
            return this.createNode<UnaryNode<T, N>>({
                type: 'Unario',
                operator: 'TIPO',
                object: argument
            });
        }

        return this.parent.get(PrimaryParser).parse();
    }
}