import { Parser } from "../../../parser";
import { ASTNode, BinaryExpressionNode } from "../../../types";
import { SubParser } from "../../subparser";

export class ComparisionParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser) {
        super(parent);
    }

    /**
     * Entry point for the SubParser.
     * Consumes the comparision operators.
     */
    public parse(): ASTNode<T, N> {
        let left = this.parent.additiveParser.parse();

        const comparisonOperators = [
            'MAYOR', 'MENOR', 'MAYOR_IGUAL', 'MENOR_IGUAL', 
            'IGUAL', 'IGUAL_TIPADO', 'NO_IGUAL', 'NO_IGUAL_TIPADO', 'DIFERENTE'
        ];

        while (comparisonOperators.includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            
            const right = this.parent.additiveParser.parse();
            
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