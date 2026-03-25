import { ASTNode } from "../../chord/types";
import { ODBNode } from "../types";
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
    abstract parse(): any;
    
    /**
     * Consumes the next token if it matches the expected type(s).
     */
    protected consume(expectedTypes: string | string[]) {
        return this.parent.consume(expectedTypes);
    }
    
    /**
     * Returns the current token without consuming it.
     */
    protected peek() {
        return this.parent.peek();
    }

    /**
     * Helper to parse Object Data Blocks (BDO).
     */
    protected parseODB(): ODBNode {
        return this.parent.parseODB();
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

    /** Optional: Trigger metadata to identify when this parser should be used */
    triggerToken: string;
    triggerValue?: string;
}