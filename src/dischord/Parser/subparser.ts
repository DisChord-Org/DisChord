import { DisChordASTNode, ODBNode } from "../types";
import { DisChordParser } from "./parser";

/**
 * Base class for all specialized DisChord parsers.
 * Provides shared utility methods to interact with the main parser's state.
 */
export abstract class SubParser {
    /**
     * @param parent - Reference to the main DisChordParser orchestrator.
     */
    constructor(protected parent: DisChordParser) {}

    /**
     * Core logic to transform tokens into a specific AST node.
     * @returns A specialized ASTNode (e.g., MessageNode, CommandNode).
     */
    abstract parse(): DisChordASTNode;
    
    /**
     * Consumes the next token if it matches the expected type(s).
     * @param expectedTypes - The expected token type to consume.
     * @param message - The message error to log.
     * @returns The consumed token.
     */
    protected consume(expectedTypes: string | string[], message?: string) {
        return this.parent.consume(expectedTypes, message);
    }
    
    /**
     * @returns The current token without consuming it.
     */
    protected peek() {
        return this.parent.peek();
    }

    /**
     * Create ASTNode's adding location data
     * @param node Omitted Node
     * @returns The generated ASTNode
     */
    protected createNode<NodeType extends DisChordASTNode> (node: Omit<NodeType, 'location'>): NodeType {
        return this.parent.createNode(node);
    }

    /**
     * Helper to parse ODB's.
     */
    protected parseODB(type: 'definition-only' | 'definition-code' = 'definition-code'): ODBNode {
        return this.parent.parseODB(type);
    }

    /**
     * Parses the current statement by chord's parser.
     * @returns The AST of the parsed statement. 
     */
    protected parseStatement(): DisChordASTNode {
        return this.parent.parseStatement();
    }

    /**
     * Helper to parse primaries identificators.
     * @returns The AST of the parsed identificator.
     */
    protected parsePrimary(): DisChordASTNode {
        return this.parent.parsePrimary();
    }
}

/**
 * Interface representing the static signature of a SubParser class.
 * Ensures that any class added to the registry implements the injection logic.
 */
export interface SubParserClass {
    /** Constructor signature: takes a DisChordParser and returns a SubParser instance */
    new (parent: DisChordParser): SubParser;
    
    /** Static method to register specific keywords into the Lexer/Parser system */
    injectStatements(): void;

    /** Trigger metadata to identify when this parser should be used */
    triggerToken: string;
}