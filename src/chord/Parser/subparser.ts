import { ASTNode, Token } from "../../chord/types";
import { SymbolTable } from "../SymbolsTable";
import { Parser } from "./parser";

/**
 * Abstract base for the Delegation Pattern in the DisChord/Chord Parser.
 * 
 * Instead of bloating the main Parser class, specific grammar rules (Statements, 
 * Expressions, Discord-specific structures) are delegated to subclasses of SubParser.
 * It provides a proxy interface to the parent Parser's state and utility methods.
 */
export abstract class SubParser<T = never, N = never> {
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
    protected peek(type: number | 'this' | 'next' | 'prev' = 'this'): Token {
        return this.parent.peek(type);
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
}

/**
 * Static blueprint for SubParser implementations.
 * Defines the contract for registration and identification of grammar specialists.
 */
export interface SubParserClass<T, N> {
    /** 
     * Constructor signature: accepts any instance that extends the base Parser.
     */
    new (parent: Parser<T, N>): SubParser<T, N>;
    
    /** 
     * The token type string that triggers the activation of this specific sub-parser.
     */
    triggerToken: string;
}