import { Parser } from "../../parser";
import { ASTNode, BinaryExpressionNode } from "../../../types";
import { SubParser } from "../../subparser";
import { ComparisionParser } from "./ComparisionParser";

export class LogicalParser<T, N> extends SubParser<T, N> {
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
     * Consumes Y / O statements.
     */
    public parse(): ASTNode<T, N> {
        let left = this.parent.get(ComparisionParser).parse();

        while ([ 'Y', 'O' ].includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            
            const right = this.parent.get(ComparisionParser).parse();
            
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