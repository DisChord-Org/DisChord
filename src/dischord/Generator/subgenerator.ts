import { DisChordASTNode, DisChordODBNode } from "../types";
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
     * Optional method for generators that act as components.
     * By default, it returns an empty string.
     * Subclasses can override this to implement custom existence logic.
     */
    public generateIfNodeExists(node: DisChordODBNode | undefined): string {
        return node ? this.generate(node) : '';
    }

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

    /**
     * Retrieves a specific property node from an ODB.
     * This utility allows sub-generators to extract configuration values 
     * or nested blocks defined within a BDO structure.
     * * @param node The ODBNode containing the property blocks.
     * @param property The key name of the property to retrieve.
     * @returns The corresponding DisChordASTNode if the property exists, otherwise undefined.
     */
    protected getODBProperty(node: DisChordODBNode, property: string): DisChordASTNode | undefined {
        return this.parent.getODBProperty(node, property);
    }

    /**
     * Safely visits a DisChordASTNode if it is defined.
     * This override ensures that optional nodes within DisChord-specific structures 
     * (such as optional ODB properties) are processed only when present, 
     * preventing null pointer exceptions during the generation phase.
     * * @override
     * @param node The DisChordASTNode to visit, or undefined.
     * @returns The generated code string for the node, or undefined if the node is missing.
     */
    protected visitIfExists (node: DisChordASTNode | undefined): string | undefined {
        return this.parent.visitIfExists(node);
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