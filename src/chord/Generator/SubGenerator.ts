import { ASTNode, BaseNode, TokenTypeUnion } from "../types";
import { Generator } from "./Generator";

/**
 * Base blueprint for all atomic node translators.
 * Mirroring the architectural pattern of SubParser.
 */
export abstract class SubGenerator<T extends string, N extends BaseNode<T>> {
    /**
     * Optional collection of reserved keywords or configurations 
     * this specific sub-generator might track.
     */
    static keywords: TokenTypeUnion<string>[] = [];

    /**
     * @param parent - Reference to the main Generator orchestrator context.
     */
    constructor(protected parent: Generator<T, N>) {}

    /**
     * Abstract contract that forces every sub-generator to implement 
     * its own AST-to-JS translation logic.
     * @param node - The specific AST node to transpile.
     * @returns {string} The resulting JavaScript code string.
     */
    public abstract visit(node: ASTNode<T, N>): string;
}

/**
 * Type utility representing the constructible signature of a SubGenerator class.
 */
export interface SubGeneratorClass<T extends string, N extends BaseNode<T>> {
    new (parent: Generator<T, N>): SubGenerator<T, N>;
}