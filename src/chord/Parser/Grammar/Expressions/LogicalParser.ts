import { Parser } from "../../../parser";
import { ASTNode, BinaryExpressionNode } from "../../../types";
import { SubParser } from "../../subparser";

export class LogicalParser<T, N> extends SubParser<T, N> {
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
     * Consumes Y / O statements.
     */
    public parse(): ASTNode<T, N> {
        // bajando el nivel de prioridad (por hacer)
        let left = this.parent.comparisonParser.parse();

        while ([ 'Y', 'O' ].includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            
            // sucede lo mismo que arriba aquí
            const right = this.parent.comparisonParser.parse();
            
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