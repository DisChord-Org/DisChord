import { ASTNode, BaseNode } from "../types";

/**
 * Checks whether a value looks like an AST node (has both `type` and `location`), without
 * needing to know about any specific node shape.
 */
function looksLikeNode (value: unknown): value is { type: unknown; location: unknown } {
    return typeof value === 'object' && value !== null && 'type' in value && 'location' in value;
}

/**
 * Recursively visits a value that might be a node, an array of nodes, or a dictionary of nodes
 * (e.g. `ODBNode.blocks: Record<string, ASTNode>`) — walking into whichever it turns out to be.
 */
function walkValue<T extends string, N extends BaseNode<T>> (value: unknown, visit: (node: ASTNode<T, N>) => void): void {
    if (!value || typeof value !== 'object') return;

    if (Array.isArray(value)) {
        value.forEach(item => walkValue(item, visit));
        return;
    }

    if (looksLikeNode(value)) {
        walkAST(value as ASTNode<T, N>, visit);
        return;
    }

    Object.values(value).forEach(item => walkValue(item, visit));
}

/**
 * Walks an AST node and every node reachable from it, calling `visit` for each one (including the
 * node passed in). Doesn't need to know the shape of any specific node type — it just inspects
 * each node's own properties generically, so it automatically covers every current and future
 * node shape without needing to be extended by hand.
 *
 * This is the tool chord provides for any `AnalysisRule` that needs to inspect the whole tree
 * (not just the top-level statements), instead of every rule writing its own traversal.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 * @param {ASTNode<T, N> | undefined} node - The node to start walking from.
 * @param {(node: ASTNode<T, N>) => void} visit - Called once for every node encountered.
 * @returns {void}
 */
export function walkAST<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N> | undefined, visit: (node: ASTNode<T, N>) => void): void {
    if (!node || typeof node !== 'object') return;

    visit(node);

    for (const key of Object.keys(node)) {
        if (key === 'type' || key === 'location') continue;

        walkValue((node as unknown as Record<string, unknown>)[key], visit);
    }
}
