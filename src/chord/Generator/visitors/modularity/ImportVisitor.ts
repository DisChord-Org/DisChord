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
            return this.renderImportStatement(node, `../lib/${libName}/src/index.js`);
        }

        if (!path.startsWith('./') && !path.startsWith('../') && !path.startsWith('/')) {
            path = `./${path}`;
        }

        if (!path.endsWith('.js')) {
            path += '.js';
        }

        return this.renderImportStatement(node, path);
    }

    /**
     * Renders the final `import ...` statement text for an already-resolved module specifier.
     * Separated from path resolution so callers that resolve the specifier differently — e.g.
     * `ClientInitVisitor`, re-emitting an import into `seyfert.config.mjs`, a file written outside
     * the normal per-file `dist/` output location — can still produce identical import syntax
     * (via `this.parent.get(ImportVisitor).renderImportStatement(...)`) without duplicating the
     * destructured/namespace/side-effect-only branching below.
     * @param {Pick<ImportNode<T>, 'identificators' | 'isDestructured'>} node - The import's identifiers and form.
     * @param {string} specifier - The already-resolved module specifier (e.g. `"./lib/foo.mjs"`).
     * @returns {string} The fully compiled inline ESM import statement.
     * @public
     */
    public renderImportStatement (node: Pick<ImportNode<T>, 'identificators' | 'isDestructured'>, specifier: string): string {
        // if the import has no identifiers, it's a side-effect-only import.
        if (node.identificators.length === 0) {
            return `import "${specifier}"`;
        }

        if (node.isDestructured) {
            const ids = node.identificators.join(', ');
            return `import { ${ids} } from "${specifier}"`;
        }

        return `import * as _${node.identificators[0]} from "${specifier}";\nconst ${node.identificators[0]} = _${node.identificators[0]}.default || _${node.identificators[0]};`;
    }
}
