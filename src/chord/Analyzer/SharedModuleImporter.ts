import path from "node:path";
import { CompilationContext } from "../model/CompilationContext";
import { ASTNode, BaseNode, ImportNode, TokenType } from "../model/types";
import { ImportSpecifier } from "../../utils/ImportSpecifier";
import { SharedModule } from "../model/SharedModule";

/**
 * Inserts the import of a shared module (one the compiler writes once to `dist/`, like the console
 * override or the runtime helpers) into the file being compiled: the one lowering step every rule that
 * needs such a module does. It adds a synthetic `ImportNode` at the front of the file, whose specifier
 * is relative to where *this file* is written (it can sit at any depth under `dist/`, since source
 * files mirror arbitrarily nested `src/` folders), and registers the module's content as an extra file
 * for `CompileCommand` to write.
 * @template {string} T - Extensible token type string vector.
 * @class SharedModuleImporter
 */
export class SharedModuleImporter<T extends string> {
    /**
     * @param {CompilationContext<T>} context - The active compilation context.
     */
    constructor (private readonly context: CompilationContext<T>) {}

    /**
     * Puts the import of a shared module at the front of `nodes` and registers its content to be written.
     * Without `identifiers` the import is for its effect (`import './x.js'`); with them it is
     * destructured (`import { a, b } from './x.js'`).
     * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
     * @param {ASTNode<T, N>[]} nodes - The top-level AST nodes of the file, which the import is put in front of.
     * @param {SharedModule} module - The module: its path relative to `dist/` and its content.
     * @param {readonly string[]} [identifiers=[]] - The names imported from it.
     */
    public insert<N extends BaseNode<T>> (nodes: ASTNode<T, N>[], module: SharedModule, identifiers: readonly string[] = []): void {
        const importNode: ImportNode<T> = {
            type: TokenType.Importar,
            identificators: [ ...identifiers ],
            isDestructured: identifiers.length > 0,
            path: ImportSpecifier.relative(this.context.outputDir, path.join(this.context.distDir, module.path)),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.distDir, module.path), module.content);
    }
}
