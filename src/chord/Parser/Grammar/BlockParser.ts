import { ASTNode, BaseNode, BlockNode, TokenType, TokenTypeUnion } from "../../types";
import { Parser } from "../parser";
import { SubParser } from "../subparser";

/**
 * @class BlockParser
 * @extends SubParser
 * @description Handles the parsing of code blocks enclosed in braces.
 */
export class BlockParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
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
     * Parses a block of statements
     * Automatically manages lexical scoping.
     * @returns {BlockNode<T, N>[]} An array of nodes representing the block's body.
     */
    public parse (): BlockNode<T, N> {
        const body: ASTNode<T, N>[] = [];

        this.consume(TokenType.L_BRACE);
        
        this.SymbolTable.pushScope();

        while (!this.isAtEnd() && this.peek().type !== TokenType.R_BRACE) {
            body.push(this.parent.parseExpression());
        }

        this.consume(TokenType.R_BRACE);
        
        this.SymbolTable.popScope();

        return this.createNode<BlockNode<T, N>>({
            type: TokenType.BLOQUE,
            body
        });
    }
}