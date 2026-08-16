import { ASTNode, BaseNode } from "../types";
import { CompilationContext } from "../../cli/commands/CompileCommand";
import { AnalysisRule } from "./AnalysisRule";
import { RequiresConsoleRuntimeRule } from "./rules/RequiresConsoleRuntimeRule";

/**
 * Engine for the semantic analysis phase, run once per file between parsing and generation:
 *
 *     const ast = parser.parse();
 *     new Analyzer(context).analyze(ast);   // <- this phase
 *     const output = generator.generate(ast);
 *
 * This class is the tool chord provides for the phase — a generic registry that runs whatever
 * `AnalysisRule`s are registered, in order. Chord registers its own rules in the constructor;
 * dialects (e.g. `DisChordAnalyzer`) call `super(context)` and then push their own on top, instead
 * of writing validation logic of their own from scratch — mirroring how `Parser`/`Generator`
 * provide the `SubParser`/`SubGenerator` registries that `DisChordParser`/`DisChordGenerator`
 * populate.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class Analyzer<T extends string, N extends BaseNode<T>> {
    /**
     * Rules this analyzer runs, in order. Chord registers its own here; subclasses push more
     * in their own constructor (after calling `super(context)`).
     * @protected
     */
    protected rules: AnalysisRule<T, N>[] = [];

    /**
     * @param context - The active compilation context (symbol table, project paths, etc.).
     */
    constructor (protected context: CompilationContext<T>) {
        this.rules.push(new RequiresConsoleRuntimeRule(context));
    }

    /**
     * Runs every registered rule over a file's complete AST, aggregating whatever shared runtime
     * modules any of them determined the file now needs.
     * @param {ASTNode<T, N>[]} nodes - The parsed top-level AST nodes for one file.
     * @returns {Map<string, string>} Combined shared-module content, keyed by path relative to `dist/`.
     * @throws {ChordError} Whatever the first violated rule throws.
     */
    public analyze (nodes: ASTNode<T, N>[]): Map<string, string> {
        const modules = new Map<string, string>();

        this.rules.forEach(rule => {
            rule.check(nodes).forEach((content, relativePath) => modules.set(relativePath, content));
        });

        return modules;
    }
}
