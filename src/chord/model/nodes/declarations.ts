import type { TokenType } from "../tokens";
import type { DataType } from "../DataType";
import type { BaseNode } from "./base";
import type { ASTNode } from "./union";

/**
 * Syntax node representing an object-oriented class declaration.
 * @interface ClassNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ClassNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Clase;
    /** The identifier naming the declared class */
    id: string;
    /** Optional parent class identifier name being inherited */
    superClass?: string;
    /** Nested collection of body nodes evaluated inside the class block scope */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node representing a routine or method declaration.
 * @interface FunctionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface FunctionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Funcion;
    /** The identifier naming the routine */
    id: string;
    /** Routine compilation flags and structural modifiers */
    metadata: {
        isConstructor: boolean;
        isStatic?: boolean;
        isMethod?: boolean;
        isAsync?: boolean;
    };
    /** Parameter identifier names requested by the signature */
    params: string[];
    /**
     * The type written after `tipo` for each parameter, in order (`undefined` for one without a
     * type). Only present when at least one parameter is annotated.
     */
    paramTypes?: (DataType | undefined)[];
    /** The type written after `->`. Only present when the signature declares one. */
    returnType?: DataType;
    /** Internal execution statements body */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node representing a collection iteration loop construct.
 * @interface LoopNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface LoopNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.BUCLE;
    /** The iteration variable bound locally to the loop block */
    var: string;
    /** The underlying collection target structure being iterated */
    iterable: ASTNode<T, N>;
    /** Loop body execution tree statements */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node representing a field configuration descriptor inside an entity scope.
 * @interface PropertyNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface PropertyNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.PROPIEDAD;
    /** Property identification descriptor name */
    id: string;
    /** Assigned instantiation expression node value */
    value: ASTNode<T, N>;
    /** Indicates if the property belongs statically to the parent namespace */
    isStatic?: boolean;
}

/**
 * Syntax node representing a data location variable assignment.
 * @interface VariableNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface VariableNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.VARIABLE;
    /** Allocated local tracking identifier */
    id: string;
    /** Assigned initializer expression structural evaluation tree */
    value: ASTNode<T, N>;
    /** Meta flag tracking class-bound context availability scopes */
    isStatic?: boolean;
    /**
     * The type explicitly written after `tipo` in this declaration (e.g. `texto`, `numero[]`) —
     * parsed and validated against the known primitive set (plus the optional union/array shape)
     * by `TypeAnnotationParser.parse`, but not yet cross-checked against `value` here (that
     * happens later, in the Analyzer's `ResolveVariableTypesRule`, via `DataType.isAssignableFrom`).
     * `undefined` when no `tipo` clause was written; the resulting `Symbol.dataType` may still end
     * up populated in that case via inference from `value`.
     */
    dataType?: DataType;
}
