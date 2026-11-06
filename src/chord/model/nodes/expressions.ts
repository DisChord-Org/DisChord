import type { TokenType } from "../tokens";
import type { BaseNode } from "./base";
import type { ASTNode } from "./union";

/**
 * Syntax node processing expressions utilizing left and right structures connected by infix operators.
 * @interface BinaryExpressionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface BinaryExpressionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.EXPRESION_BINARIA;
    /** Left side child member expression tree node */
    left: ASTNode<T, N>;
    /** Raw mathematical/logical token string connecting the expression */
    operator: string;
    /** Right side child member expression tree node */
    right: ASTNode<T, N>;
}

/**
 * Syntax node hosting primitive absolute data values.
 * @interface LiteralNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface LiteralNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.LITERAL;
    /** Evaluated primitive script host value representation */
    value: string | number | boolean | undefined;
    /** Exact source textual literal matching token reference */
    raw: string;
}

/**
 * Syntax node controlling entity object creation allocations via initialization instantiation calls.
 * @interface NewNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface NewNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Nuevo;
    /** Structural constructor object targeting execution instantiation */
    object: ASTNode<T, N>;
}

/**
 * Syntax node representing a negative logical operation.
 * @interface NoUnaryNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface NoUnaryNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.NO_UNARIO;
    /** Applied operational tracking character operator */
    operator: string;
    /** Evaluated target expression being negated */
    object: ASTNode<T, N>;
}

/**
 * Syntax node executing classic standalone operational modifiers against an expression target.
 * @interface UnaryNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface UnaryNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.UNARIO;
    /** Applied structural character operator */
    operator: string;
    /** Targeted target expression subject */
    object: ASTNode<T, N>;
}

/**
 * Syntax node defining an ordered list or array data collection expression.
 * @interface ListNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ListNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.LISTA;
    /** Ordered compilation tracking child nodes embedded within the list context */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node grouping an isolated operation block wrapping context expressions.
 * @interface ExpressionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ExpressionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.EXPRESION;
    /** Wrapped inner targeted execution node reference */
    object: ASTNode<T, N>;
    /** Present, and `true`, when the lexer wrote these parentheses itself for an interpolated text
     * (`"hola {nombre}"`): the expression is the one between the braces, not one the user
     * parenthesized. */
    interpolated?: true;
}

/**
 * Syntax node binding a unique identifier string name value representing an operational reference symbol.
 * @interface IdentificatorNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface IdentificatorNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.IDENTIFICADOR;
    /** The literal value name string of the identifier */
    value: string;
}

/**
 * Syntax node reading properties inside an object data structure layout.
 * @interface AccessNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface AccessNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.ACCESO;
    /** Object structural element containing target properties */
    object: ASTNode<T, N>;
    /** Selected tracking string field identifier name being queried */
    property: string;
}

/**
 * Syntax node reading values dynamically out of an array or map data map via bracket index references.
 * @interface AccessNodeByIndex
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface AccessNodeByIndex<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.ACCESO_POR_INDICE;
    /** Targeted index collection object element */
    object: ASTNode<T, N>;
    /** Index target evaluation structural selector expression */
    index: ASTNode<T, N>;
}

/**
 * Syntax node triggering method/routine operations payload evaluation bindings passing sequential argument nodes.
 * @interface CallNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface CallNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.LLAMADA;
    /** Targeted execution function routine element */
    object: ASTNode<T, N>;
    /** Injected sequential parameter arguments list expressions */
    params: ASTNode<T, N>[];
}

/**
 * Syntax node injecting parent object scoping access lookup pointers inside class environments.
 * @interface SuperNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface SuperNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Super;
    value: '';
}

/**
 * Syntax node tracking self instance runtime context references pointers mapping current scopes environments.
 * @interface ThisNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface ThisNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Esta;
    value: '';
}
