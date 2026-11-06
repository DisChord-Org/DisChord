import type { TokenType } from "../tokens";
import type { BaseNode } from "./base";
import type { ASTNode } from "./union";

/**
 * Syntax node representing logical bifurcations in execution paths.
 * @interface ConditionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ConditionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.CONDICION;
    /** Analytical predicate boolean testing block */
    test: ASTNode<T, N>;
    /** Consequent execution path if the testing criteria resolves positive */
    consequent: ASTNode<T, N>[];
    /** Alternative alternate sequence block path or stacked subconditions */
    alternate?: ASTNode<T, N>[] | ConditionNode<T, N>;
}

/**
 * Syntax node representing short-circuit termination directives in active looping frames.
 * @interface ExitLoopNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface ExitLoopNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Salir;
}

/**
 * Syntax node representing quick shortcut skip updates inside iteration loops frames.
 * @interface PassLoopNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface PassLoopNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Pasar;
}

/**
 * Syntax node commanding stack extraction routine value reflections back to initial frame callers.
 * @interface ReturnNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ReturnNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Devolver;
    /** Reflected tracking expression structure target value, if any */
    object: ASTNode<T, N> | undefined;
}

/**
 * Syntax node handling external component tracking exports deployment blocks.
 * @interface ExportNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ExportNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Exportar;
    /** Nested reference target block node designated for module system exports */
    object: ASTNode<T, N>;
}

/**
 * Syntax node fetching references extracted out of structural modular package resources paths.
 * @interface ImportNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface ImportNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Importar;
    /** Target symbol string identifier arrays requested into internal scope names spaces */
    identificators: string[];
    /** Relative system string path location mapping package target files layout */
    path: string;
    /** Specifies whether the module inclusion strategy applies destructuring patterns */
    isDestructured: boolean;
}

/**
 * Syntax node evaluating assignment mutations binding left targets to updated value states.
 * @interface AssignmentNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface AssignmentNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.ASIGNACION;
    /** Subject targeted tracking element receiver expression node */
    left: ASTNode<T, N>;
    /** Source computation structure evaluation supplying incoming replacement states data */
    assignment: ASTNode<T, N>;
}

/**
 * Syntax node bypassing standard analysis injected raw output scripts down stream pipelines directly.
 * @interface JSNode
 * @template {string} T - Token extensions vector.
 */
export interface JSNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.JS,
    /** Inline execution runtime string script payload text content */
    value: string;
}

/**
 * Syntax node organizing sequences of expressions isolated inside unique block scopes namespaces limits.
 * @interface BlockNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface BlockNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.BLOQUE;
    /** Internal execution statements tree data sequential nodes array list */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node capturing End Of File markers signaling lexical boundary terminal completions points.
 * @interface EOF
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface EOF<T extends string> extends BaseNode<T> {
    type: typeof TokenType.EOF;
    value: '';
}

/**
 * Syntax node capturing Start Of File tracking triggers ensuring early system environment setups configurations.
 * @interface SOF
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface SOF<T extends string> extends BaseNode<T> {
    type: typeof TokenType.SOF;
    value: '';
}

/**
 * Execution strategy modifiers configuration settings mapping ODB structural optimization steps.
 * @enum {number}
 */
export enum ODBMode {
    Simple = 0,
    Intelligent = 1
}

/**
 * Syntax node controlling declarative database object processing abstractions configurations layouts.
 * @interface ODBNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ODBNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.BDO;
    /** Target optimization execution configuration strategy layer choice mode setting */
    mode: ODBMode;
    /** Record map dictionary pairing configuration namespace string keys onto evaluation expression trees nodes */
    blocks: Record<string, ASTNode<T, N>>;
    /** Array containing procedural statements bound to the target space setup context */
    body: ASTNode<T, N>[];
}
