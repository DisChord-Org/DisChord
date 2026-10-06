import { ASTNode, BaseNode, PeekType, Token, TokenType, TokenTypeUnion } from "../types";
import { SymbolTable } from "../SymbolsTable";
import { Parser } from "./Parser";

/**
 * Abstract base for the Delegation Pattern in the DisChord/Chord Parser.
 * 
 * Instead of bloating the main Parser class, specific grammar rules (Statements, 
 * Expressions, Discord-specific structures) are delegated to subclasses of SubParser.
 * It provides a proxy interface to the parent Parser's state and utility methods.
 */
export abstract class SubParser<T extends string, N extends BaseNode<T>> {
    /**
     * Token types that look like a word but can't be taken as a member name: literals the lexer
     * resolves from a word (`verdadero`, `indefinido`, ...), whose own value doesn't survive in
     * a form that can be reused.
     */
    private static readonly NON_RECOVERABLE_MEMBER_NAMES: ReadonlySet<string> = new Set([
        TokenType.IDENTIFICADOR, TokenType.BOOLEANO, TokenType.TEXTO, TokenType.NUMERO, TokenType.BIGINT, TokenType.Decorador, TokenType.Indefinido
    ]);

    /**
     * @param parent - Reference to the orchestrator Parser instance (Chord or DisChord).
     */
    constructor(protected parent: Parser<T, N>) {}

    /**
     * Executes the specific parsing logic for this grammar unit.
     * @returns A specialized ASTNode or a generic ASTNode branch.
     */
    abstract parse(): ASTNode<T, N>;
    
    /**
     * Proxies the consumption of tokens to the parent parser.
     * Advances the token pointer if the type matches.
     */
    protected consume(expectedTypes: string | string[], message?: string) {
        return this.parent.consume(expectedTypes, message);
    }

    /**
     * Looks ahead at tokens through the parent's token stream without consuming them.
     * @returns The current token without consuming it.
     */
    protected peek(type: PeekType = 'this'): Token<T> {
        return this.parent.peek(type);
    }

    /**
     * Whether a token is a reserved word whose own text can be used as the name of a class member
     * (`funcion en() {}`, `prop entre`), so members can carry the names of the core library's
     * (`Lista.en`). Free functions, variables, parameters and class names don't use this: they keep
     * rejecting reserved words.
     * @param token - The token to check.
     * @returns `true` if it is a keyword written as a plain word.
     */
    protected isReservedMemberName(token: Token<T>): boolean {
        return !SubParser.NON_RECOVERABLE_MEMBER_NAMES.has(token.type) && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(token.value);
    }

    /**
     * Attempts to parse a custom statement by delegating back to the parent's orchestrator.
     * @returns The parsed AST or null.
     */
    protected parseCustomStatement(): ASTNode<T, N> | null {
        return this.parent.parseCustomStatement();
    }

    /**
     * Generates an ASTNode using the parent's factory method to ensure 
     * correct source code location metadata is attached.
     * @param node Omitted Node
     * @returns The generated ASTNode
     */
    protected createNode<NodeType extends ASTNode<T, N>> (node: Omit<NodeType, 'location'>): NodeType {
        return this.parent.createNode(node);
    }

    public get cursor (): number {
        return this.parent.cursor;
    }
    
    public get SymbolTable (): SymbolTable {
        return this.parent.SymbolTable;
    }

    public isAtEnd (): boolean {
        return this.parent.isAtEnd();
    }

    public match(types: string | string[]): boolean {
        return this.parent.match(types);
    }
}

/**
 * Static blueprint for SubParser implementations.
 * Defines the contract for registration and identification of grammar specialists.
 * @template T - Extensible custom token types vector.
 * @template N - Extensible custom AST node structures vector.
 */
export interface SubParserClass<T extends string, N extends BaseNode<T>> {
    /** 
     * Constructor signature: accepts any instance that extends the base Parser.
     */
    new (parent: Parser<T, N>): SubParser<T, N>;
    
    /** 
     * The token type string that triggers the activation of this specific sub-parser.
     */
    triggerToken: TokenTypeUnion<T> | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    keywords: TokenTypeUnion<T | string>[];
}