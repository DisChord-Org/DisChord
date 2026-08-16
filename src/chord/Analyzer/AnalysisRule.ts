import { ASTNode, BaseNode } from "../types";
import { CompilationContext } from "../../cli/commands/CompileCommand";

/**
 * Base class for a single semantic analysis rule.
 *
 * Mirrors `SubParser`/`SubGenerator`: each rule is one focused, independently testable check
 * against a file's complete AST. An `Analyzer` subclass (chord's own, or a dialect's) just lists
 * which rules apply — it doesn't write validation logic inline itself. This is the tool chord's
 * engine provides; dialects extend `AnalysisRule` to add their own checks instead of building
 * their own ad-hoc traversal/validation code.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export abstract class AnalysisRule<T extends string, N extends BaseNode<T>> {
    /**
     * @param context - The active compilation context (symbol table, project paths, etc.).
     */
    constructor (protected context: CompilationContext<T>) {}

    /**
     * Runs this rule against a file's complete top-level AST. May mutate `nodes` directly (e.g.
     * inserting a synthetic import) — that's a normal compiler "lowering" step, not a side effect
     * to avoid, since `nodes` is what `Generator` renders next. If the rule determines the file
     * now needs an extra file written (a shared runtime module, ...), it registers it via
     * `this.context.extraFiles.set(absolutePath, content)` — see `CompilationContext.extraFiles`.
     * @param {ASTNode<T, N>[]} nodes - The parsed top-level AST nodes for one file.
     * @returns {void}
     * @throws {ChordError} For any violation this rule finds.
     */
    abstract check (nodes: ASTNode<T, N>[]): void;
}
