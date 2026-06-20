import { BaseNode, ImportNode, TokenType, TokenTypeUnion } from "../../../types";
import { SubGenerator } from "../../SubGenerator";

/**
 * Atomic SubGenerator compiling modular file dependencies and framework internal libraries definitions.
 * @class ImportVisitor
 * @extends {SubGenerator<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ImportVisitor<T extends string, N extends BaseNode<T>> extends SubGenerator<T, N> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.Importar;

    /**
     * Normalizes and transpiles static file imports into standard JS module dependencies.
     * @param {N} rawNode - The generic syntax tree node instance.
     * @returns {string} The fully compiled inline ESM import statement or IIFE block wrapper string.
     * @public
     */
    public visit(node: ImportNode<T>): string {        
        let path = node.path.replace(/\.chord$/, '');

        if (path.startsWith('lib:')) {
            const libName = path.split(':')[1];
            path = `../lib/${libName}/src/${libName}.mjs`;
        }

        if (!path.startsWith('./') && !path.startsWith('../') && !path.startsWith('/')) {
            path = `./${path}`;
        }

        if (!path.endsWith('.mjs')) {
            path += '.mjs';
        }

        if (node.isDestructured) {
            const ids = node.identificators.join(', ');
            return `import { ${ids} } from "${path}"`;
        }
        
        return `import * as _${node.identificators[0]} from "${path}";\nconst ${node.identificators[0]} = _${node.identificators[0]}.default || _${node.identificators[0]};`;
    }
}