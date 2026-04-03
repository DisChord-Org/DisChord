import { DisChordASTNode } from "../types";
import { DisChordGenerator } from "./generator";

/**
 * Base class for all specialized DisChord generators.
 * Provides shared utility methods to interact with the main generator's state.
 */
export abstract class SubGenerator {
    /**
     * @param parent - Reference to the main DisChordGenerator orchestrator.
     */
    constructor(protected parent: DisChordGenerator) {}

    /**
     * Core logic to transform AST node into code string.
     * @returns The resulted code string.
     */
    abstract generate(node: DisChordASTNode): string;

    /**
     * The visit method to handle DisChord-specific AST nodes.
     * It checks the type of the node and delegates code generation to the appropriate generator class based on the node type.
     * @param node The AST node to visit, which can be of various types defined in the DisChordNodeType enum.
     * @returns The generated code for the given node.
     */
    protected visit(node: DisChordASTNode): string {
        return this.parent.visit(node);
    }
}

/**
 * Interface representing the static signature of a SubGenerator class.
 * Ensures that any class added to the registry implements the injection logic.
 */
export interface SubGeneratorClass {
    /** Constructor signature: takes a DisChordGenerator and returns a SubGenerator instance */
    new (parent: DisChordGenerator): SubGenerator;
    
    /** Trigger metadata to identify when this parser should be used */
    triggerToken: string;
}