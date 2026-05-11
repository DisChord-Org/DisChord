import { ASTNode } from "../../../types";
import { Parser } from "../../parser";
import { SubParser } from "../../subparser";
import { AssignmentParser } from "./AssignmentParser";

/**
 * # Parser levels
 * 
 * 1. (manager) ExpressionParser
 * 2. (lower)   AssignmentParser
 * 3.           LogicalParser
 * 4.           ComparisionParser
 * 5.           AditiveParser
 * 6.           ArithmeticParser
 * 7.           UnaryParser
 * 8.           AccessParser
 * 9.           PrimaryParser           ->      AssignmentParser
 */

export class ExpressionParser<T, N> extends SubParser<T, N> {
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
     * Consumes the ES statement and calls the expressions subparsers.
     */
    public parse(): ASTNode<T, N> {
        return this.parent.get(AssignmentParser).parse();
    }
}