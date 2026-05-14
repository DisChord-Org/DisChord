import { ASTNode, BlockNode } from "../../types";
import { Parser } from "../parser";
import { SubParser } from "../subparser";

/**
 * @class BlockParser
 * @extends SubParser
 * @description Handles the parsing of code blocks enclosed in braces.
 */
export class BlockParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';

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

        this.consume('L_BRACE', "Se esperaba '{' para iniciar el bloque.");
        
        this.SymbolTable.pushScope();

        while (!this.isAtEnd() && this.peek().type !== 'R_BRACE') {
            body.push(this.parent.parseExpression());
        }

        this.consume('R_BRACE', "Se esperaba '}' para cerrar el bloque.");
        
        this.SymbolTable.popScope();

        return this.createNode<BlockNode<T, N>>({
            type: 'Bloque',
            body
        });
    }
}