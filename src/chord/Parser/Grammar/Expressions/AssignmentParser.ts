import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { Parser } from "../../Parser";
import { SubParser } from "../../SubParser";
import { LogicalParser } from "./LogicalParser";

export class AssignmentParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Es;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Es ];

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
        return this.parent.get(LogicalParser).parse();
    }
}