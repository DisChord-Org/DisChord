import { ASTNode, BaseNode, ImportNode, TokenType } from '../types';

export interface CollectedImport<T extends string> {
    node: ImportNode<T>;
}

/**
 * Utility class for collecting import nodes from AST collections.
 * 
 * @class ImportCollector
 */
export class ImportCollector {
    /**
     * Filters and collects top-level import nodes from a list of AST nodes.
     * 
     * @template T
     * @template N
     * @param {ASTNode<T, N>[]} nodes - Array of AST nodes to inspect.
     * @returns {ImportNode<T>[]} List of collected ImportNode elements.
     */
    public static collectTopLevel<T extends string, N extends BaseNode<T>>(
        nodes: ASTNode<T, N>[]
    ): ImportNode<T>[] {
        return nodes.filter((node): node is ImportNode<T> => node.type === TokenType.Importar);
    }
}