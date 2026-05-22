import { SubParser } from "../../chord/Parser/subparser";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../types";
import { DisChordParser } from "./parser";

/**
 * Base class for all specialized DisChord parsers.
 * Provides shared utility methods to interact with the main parser's state.
 */
export abstract class DisChordSubParser extends SubParser<DisChordNodeType, DisChordNode> {
    /**
     * @param parent - Reference to the main DisChordParser orchestrator.
     */
    constructor(protected parent: DisChordParser) {
        super(parent);
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
    new (parent: DisChordParser): SubParser<DisChordNodeType, DisChordNode>;
    
    /** Static method to register specific keywords into the Lexer/Parser system */
    injectStatements(): void;

    /** Trigger metadata to identify when this parser should be used */
    triggerToken: DisChordTokenType | undefined;

    /**
     * Static property listing the specific keywords this SubParser is responsible for.
     */
    keywords: DisChordTokenType[];
}