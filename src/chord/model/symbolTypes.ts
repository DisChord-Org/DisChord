/**
 * @file symbolTypes.ts
 * @description What the analyzer records about a name: the kinds of symbols, the metadata the compiler keeps while it analyzes, and the entry of the symbol table.
 */

import type { DataType } from "./DataType";

/**
 * Defines the operational categories of symbols encountered during semantic analysis.
 * Used by the Symbol Table to differentiate identifiers and enforce type-checking boundaries.
 * @enum {number}
 */
export enum SymbolKind {
    /** Represents a mutable or immutable variable allocation binding. */
    Variable,
    
    /** Represents a reusable routine block declaration with scoped parameters. */
    Function,
    
    /** Represents an object-oriented structural blueprint definition wrapper. */
    Class,
    
    /** Represents an isolated state field or member attribute locked inside a Class context. */
    Property,

    /**
     * Represents a named block declared by an extension layer (e.g. DisChord's `comando`/`evento`)
     * whose semantics are opaque to the core compiler. The engine only tracks that the name is
     * taken in the current scope (for duplicate-declaration detection); it has no notion of
     * inheritance, members, or instantiation like it does for `Class`.
     */
    Declaration
};

/**
 * Defines internal compiler-tracked flags stored per-scope in the Symbol Table.
 * Unlike user-declared symbols, these are compiler-owned state used during
 * generation (or other phases) to track contextual information across nested scopes —
 * e.g. whether the current code is being generated inside an interaction callback.
 * @enum {string}
 */
export enum CompilerMetadataKind {
    IsInteraction = 'isInteraction',
    RequiresAsync = 'requiresAsync',
    CurrentClass = 'currentClass'
};

/**
 * Represents an entry in the compiler's Symbol Table.
 * @interface Symbol
 */
export interface Symbol {
    /** The identifier name of the symbol */
    name: string;
    /** The structural category of the symbol */
    kind: SymbolKind;
    /** Compile-time flags and metadata modifier properties */
    metadata: {
        isAsync?: boolean;
        isExported?: boolean;
        isStatic?: boolean;
    };
    /**
     * The symbol's resolved type, if any. Unlike `VariableNode.dataType` — which only ever holds
     * what the user literally wrote after `tipo` — this is the *final* answer: an explicit
     * annotation, or the type inferred from a literal (or homogeneous array literal) initializer
     * when no annotation was written — `cualquiera` if a reassignment of such a variable has
     * another type or one that can't be inferred. Left `undefined` at registration time (Analyzer Pass 2,
     * `BindDeclarationsRule`) and filled in afterwards by Pass 3 (`ResolveVariableTypesRule`, via
     * `SymbolTable.setDataType`), once the whole file's declarations are visible.
     */
    dataType?: DataType;
    /**
     * For a function, the types its signature declares: one entry per parameter (`undefined` for
     * one written without a type) and the return type, if any. Absent when the signature has no
     * annotation at all.
     */
    signature?: {
        params: (DataType | undefined)[];
        returns?: DataType;
    };
};
