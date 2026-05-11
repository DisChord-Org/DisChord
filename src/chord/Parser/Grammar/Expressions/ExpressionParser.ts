import { Parser } from "../../../parser";
import { ASTNode } from "../../../types";
import { SubParser } from "../../subparser";

export class ExpressionParser<T, N> extends SubParser<T, N> {
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
     * Consumes the ES statement and calls the expressions subparsers.
     */
    public parse(): ASTNode<T, N> {
        return this.parent.assignment.parse();
    }
}