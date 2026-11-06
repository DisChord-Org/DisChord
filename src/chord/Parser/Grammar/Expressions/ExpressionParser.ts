import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../model/types";
import { SubParser } from "../../SubParser";
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
 * 9.           PrimaryParser           ->      AssignmentParser (the items of a list and of a call),
 *                                              ExpressionParser (a parenthesized expression),
 *                                              BDOParser (a `{ ... }` block)
 */

export class ExpressionParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

    /**
     * Entry point for the SubParser.
     * Delegates to the lowest-precedence level, `AssignmentParser`, which calls the rest.
     */
    public parse(): ASTNode<T, N> {
        return this.parent.get(AssignmentParser).parse();
    }
}