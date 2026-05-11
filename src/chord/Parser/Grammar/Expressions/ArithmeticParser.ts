import { Parser } from "../../parser";
import { ASTNode, BinaryExpressionNode } from "../../../types";
import { SubParser } from "../../subparser";
import { UnaryParser } from "./UnaryParser";

export class ArithmeticParser<T, N> extends SubParser<T, N> {
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
     * Consumes the arithmetic operators.
     */
    public parse(): ASTNode<T, N> {
        let left = this.parent.get(UnaryParser).parse();

        const highPriorityOps = ['POR', 'ENTRE', 'RESTO', 'EXP'];

        while (highPriorityOps.includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            const right = this.parent.get(UnaryParser).parse();
            
            left = this.createNode<BinaryExpressionNode<T, N>>({
                type: 'ExpresionBinaria',
                left,
                operator: operator.type,
                right
            });
        }

        return left;
    }
}