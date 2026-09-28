import { ASTNode, BaseNode, TokenTypeUnion } from "../types";
import { DataType } from "../DataType";
import { TypeInferrer } from "./TypeInferrer";

/**
 * Base blueprint for a single node-shape's type inference rule — mirrors `SubGenerator`: each
 * `SubInferrer` handles inferring a `DataType` for exactly one AST node shape (a literal, an
 * identifier, a binary expression, a list literal, ...), the same way a `SubGenerator` handles
 * translating exactly one node shape to JS. `ResolveVariableTypesRule` (the only current caller)
 * delegates to `TypeInferrer.infer` instead of running its own per-node-type `if`-chain.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export abstract class SubInferrer<T extends string, N extends BaseNode<T>> {
    /**
     * @param parent - Reference to the orchestrating `TypeInferrer`, used to recursively infer a
     * node's children (e.g. a binary expression's operands) and to reach `parent.context` (the
     * `SymbolTable`, for an identifier lookup).
     */
    constructor (protected parent: TypeInferrer<T, N>) {}

    /**
     * Infers this node shape's `DataType`.
     * @param {ASTNode<T, N>} node - The node to infer a type for (always the shape this
     * `SubInferrer` is registered for — see `triggerToken`).
     * @returns {DataType | undefined} The inferred type, or `undefined` if this particular node
     * isn't inferrable (e.g. an identifier the `SymbolTable` hasn't resolved a type for yet).
     */
    public abstract infer (node: ASTNode<T, N>): DataType | undefined;
}

/**
 * Static blueprint for `SubInferrer` implementations — mirrors `SubGeneratorClass`.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export interface SubInferrerClass<T extends string, N extends BaseNode<T>> {
    new (parent: TypeInferrer<T, N>): SubInferrer<T, N>;

    /** The node type string this `SubInferrer` infers a type for. */
    triggerToken: TokenTypeUnion<T> | undefined;
}
