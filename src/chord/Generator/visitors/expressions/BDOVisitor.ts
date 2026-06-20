import { ODBNode, BaseNode, TokenType, TokenTypeUnion, ODBMode, ASTNode } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling Chord structured object block expressions (BDO).
 * Seamlessly switches between simple key-value maps and advanced isolated execution blocks wrapped in IIFEs.
 * @class BDOVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class BDOVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.BDO;

    /**
     * Transpiles a BDO structure into an optimized declarative object literal or an encapsulated scope closure.
     * @param {ODBNode<T, N>} node - The target object block structure tree node.
     * @returns {string} The formatted runnable native JavaScript object blueprint representation string.
     * @public
     */
    public visit(node: ODBNode<T, N>): string {
        if (node.mode === ODBMode.Simple) {
            const props = Object.entries(node.blocks).map(([key, value]) => {
                return `${key}: ${this.parent.visit(value as ASTNode<T, N>)}`;
            });
            return `{ ${props.join(', ')} }`;
        }

        const declarations = Object.entries(node.blocks).map(([key, value]) => {
            return `let ${key} = ${this.parent.visit(value as ASTNode<T, N>)};`;
        }).join('\n');

        const executableBody = node.body
            .map(stmt => this.parent.visit(stmt as unknown as ASTNode<T, N>))
            .join(';\n');

        const exports = Object.keys(node.blocks).join(', ');

        return `(() => {
                ${declarations}
                ${executableBody}
                return { ${exports} }
            })()`;
    }

    /**
     * Safely retrieves a specific property node from an Object Definition Block (BDO).
     * @param {ODBNode<T, N>} node - The target object definition block node.
     * @param {string} property - The identifier key of the property to retrieve.
     * @returns {ASTNode<T, N> | undefined} The matching abstract syntax tree node, or undefined if not found.
     * @public
     */
    public getODBProperty(node: ODBNode<T, N>, property: string): ASTNode<T, N> | undefined {
        return node.blocks[property];
    }
}