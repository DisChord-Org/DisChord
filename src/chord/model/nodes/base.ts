import type { Location, TokenType } from "../tokens";

/**
 * Resolves the final comprehensive type classification for any given AST node.
 * @template T - Extensible custom node types injection.
 */
export type NodeType<T extends string> = TokenType | T;

/**
 * Base abstract blueprint for every syntax tree node generated during parsing.
 * @interface BaseNode
 * @template T - Custom token/node type overriding hook.
 */
export interface BaseNode<T extends string> {
    /** Strictly typed structural classifier matching the Registry or extensions */
    readonly type: NodeType<T>;
    /** Code coordinates tracking for execution errors */
    location: Location;
};
