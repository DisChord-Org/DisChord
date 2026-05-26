import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { Parser } from "../../parser";
import { SubParser } from "../../subparser";
import { AssignmentParser } from "./AssignmentParser";

/**
 * ### Parser levels
 * 
 * 1.           ExpressionParser - (manager)
 * 2.           AssignmentParser - (lower)
 * 3.           LogicalParser
 * 4.           ComparisionParser
 * 5.           AditiveParser
 * 6.           ArithmeticParser
 * 7.           UnaryParser
 * 8.           AccessParser
 * 9.           PrimaryParser           ->      AssignmentParser
 */

export class ExpressionParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

   /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

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