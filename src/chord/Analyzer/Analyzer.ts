import { ASTNode, BaseNode } from "../types";
import { CompilationContext } from "../../cli/commands/CompileCommand";
import { AnalysisRule } from "./AnalysisRule";

/**
 * Engine for the semantic analysis phase, run once per file between parsing and generation:
 *
 *     const ast = parser.parse();
 *     new Analyzer(context).analyze(ast);   // <- this phase
 *     const output = generator.generate(ast);
 *
 * This class is the tool chord provides for the phase — a generic registry that runs whatever
 * `AnalysisRule`s a subclass lists, in order. Chord itself has no rules of its own yet (`rules`
 * defaults to empty); dialects (e.g. `DisChordAnalyzer`) populate `rules` with their own
 * `AnalysisRule` subclasses instead of writing validation logic of their own from scratch —
 * mirroring how `Parser`/`Generator` provide the `SubParser`/`SubGenerator` registries that
 * `DisChordParser`/`DisChordGenerator` populate.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class Analyzer<T extends string, N extends BaseNode<T>> {
    /**
     * Rules this analyzer runs, in order. Empty by default — see class doc.
     * @protected
     */
    protected rules: AnalysisRule<T, N>[] = [];

    /**
     * @param context - The active compilation context (symbol table, project paths, etc.).
     */
    constructor (protected context: CompilationContext<T>) {}

    /**
     * Runs every registered rule over a file's complete AST.
     * @param {ASTNode<T, N>[]} nodes - The parsed top-level AST nodes for one file.
     * @returns {void}
     * @throws {ChordError} Whatever the first violated rule throws.
     */
    public analyze (nodes: ASTNode<T, N>[]): void {
        this.rules.forEach(rule => rule.check(nodes));
    }
}
