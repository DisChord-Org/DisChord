import { AccessNode, ASTNode, BaseNode, ClassNode, FunctionNode, IdentificatorNode, ImportNode, PropertyNode, TokenType, VariableNode } from "./types";

/**
 * Type guards for `ASTNode`. `ASTNode` is a union that ends in the extensible `N`, whose `type`
 * can be anything, so comparing `node.type` against a `TokenType` never narrows it by itself.
 * These guards do that narrowing once, so callers don't need `as unknown as` casts.
 */

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is a property access (`objeto.propiedad`).
 */
export function isAccessNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is AccessNode<T, N> {
    return node.type === TokenType.ACCESO;
}

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is an identifier.
 */
export function isIdentificatorNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is IdentificatorNode<T> {
    return node.type === TokenType.IDENTIFICADOR;
}

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is an import statement.
 */
export function isImportNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is ImportNode<T> {
    return node.type === TokenType.Importar;
}

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is a class declaration.
 */
export function isClassNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is ClassNode<T, N> {
    return node.type === TokenType.Clase;
}

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is a function declaration.
 */
export function isFunctionNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is FunctionNode<T, N> {
    return node.type === TokenType.Funcion;
}

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is a variable declaration.
 */
export function isVariableNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is VariableNode<T, N> {
    return node.type === TokenType.VARIABLE;
}

/**
 * @param {ASTNode<T, N>} node - Node to check.
 * @returns {boolean} `true` if the node is a class property declaration.
 */
export function isPropertyNode<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): node is PropertyNode<T, N> {
    return node.type === TokenType.PROPIEDAD;
}
