import { ASTNode, BaseNode, TokenType } from "../types";
import { CompilationContext } from "../../cli/commands/CompileCommand";
import { AnalysisRule, AnalysisRuleClass } from "./AnalysisRule";
import { BindImportsRule } from "./rules/BindImportsRule";
import { ValidateImportTargetsRule } from "./rules/ValidateImportTargetsRule";
import { BindDeclarationsRule } from "./rules/BindDeclarationsRule";
import { ValidateTypeAnnotationsRule } from "./rules/ValidateTypeAnnotationsRule";
import { ResolveVariableTypesRule } from "./rules/ResolveVariableTypesRule";
import { ValidateAssignmentTypesRule } from "./rules/ValidateAssignmentTypesRule";
import { ValidateCallTargetsRule } from "./rules/ValidateCallTargetsRule";
import { ValidateReturnTypesRule } from "./rules/ValidateReturnTypesRule";
import { ValidateCallArgumentsRule } from "./rules/ValidateCallArgumentsRule";
import { ResolveAwaitedCallsRule } from "./rules/ResolveAwaitedCallsRule";
import { ResolveDispatchedCallsRule } from "./rules/ResolveDispatchedCallsRule";
import { ResolveAccessRolesRule } from "./rules/ResolveAccessRolesRule";
import { ResolveMemberAccessesRule } from "./rules/ResolveMemberAccessesRule";
import { RequiresConsoleRuntimeRule } from "./rules/RequiresConsoleRuntimeRule";
import { RequiresRuntimeHelpersRule } from "./rules/RequiresRuntimeHelpersRule";

/**
 * Engine for the semantic analysis phase, run once per file between parsing and generation:
 *
 *     const ast = parser.parse();
 *     new Analyzer(context).analyze(ast);          // <- this phase
 *     const output = new Generator(context, ast).generate();
 *
 * This class is the tool chord provides for the phase — a generic registry that runs whatever
 * `AnalysisRule`s are registered, in order. Chord declares its own in the static {@link Rules} list;
 * dialects (e.g. `DisChordAnalyzer`) override {@link registerRules} to push their own on top of
 * `super.registerRules()` — the same static-registry shape `Parser.SubParsers`/`Generator.SubGenerators`
 * already use, instead of writing validation logic of their own from scratch.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class Analyzer<T extends string, N extends BaseNode<T>> {
    /**
     * Rules this analyzer runs, in order. Populated by {@link registerRules} from the static
     * {@link Rules} list.
     * @protected
     */
    protected rules: AnalysisRule<T, N>[] = [];

    /**
     * Chord's own analysis rules, in the order they must run — mirrors `Parser.SubParsers`: a
     * static, declarative list instead of imperative `this.rules.push(...)` calls in the
     * constructor.
     * @private
     * @static
     */
    private static readonly Rules: AnalysisRuleClass<TokenType, BaseNode<TokenType>>[] = [
        // Pass 1 ("Imports"): bind every imported name before anything else needs to see it.
        BindImportsRule,

        // Import targets must exist. Runs before any lowering rule inserts a synthetic import
        // (those point at generated `dist/` files with no source counterpart).
        ValidateImportTargetsRule,

        // Pass 2 ("Variables"): bind every declaration (classes, functions, variables,
        // properties) across the whole file, so forward references resolve regardless of
        // source order.
        BindDeclarationsRule,

        // Pass 3 ("Tipos"): reference/type validation against the now-complete symbol table. The
        // names an annotation uses are checked first, so the rest can trust them.
        ValidateTypeAnnotationsRule,
        ResolveVariableTypesRule,
        ValidateCallTargetsRule,

        // Reassignment validation — needs every variable's dataType already resolved by Pass 3
        // above, so it runs after it rather than as part of it.
        ValidateAssignmentTypesRule,

        // Checks each `devolver` against the declared return type; needs the types resolved by Pass 3.
        ValidateReturnTypesRule,

        // Checks the arguments of each call against the declared parameter types.
        ValidateCallArgumentsRule,

        // Decides which calls are awaited; needs the types resolved by Pass 3.
        ResolveAwaitedCallsRule,

        // Decides how calls on a receiver of union type are emitted; needs the same resolved types.
        ResolveDispatchedCallsRule,

        // Records whether each member access is a callee, an assignment target or a read.
        ResolveAccessRolesRule,

        // Decides the name each member access is emitted with; needs the types and the roles above.
        ResolveMemberAccessesRule,

        // Lowering rules — independent of the 3-pass binding model above, they don't touch
        // SymbolTable at all.
        RequiresConsoleRuntimeRule,
        RequiresRuntimeHelpersRule
    ];

    /**
     * @param context - The active compilation context (symbol table, project paths, etc.).
     */
    constructor (protected context: CompilationContext<T>) {
        this.registerRules();
    }

    /**
     * Instantiates every rule in {@link Rules} against this analyzer's context, in order. A
     * dialect subclass overrides this to call `super.registerRules()` first (so its own rules run
     * after chord's, preserving the 3-pass binding model) and then push its own rule classes.
     * @protected
     */
    protected registerRules (): void {
        Analyzer.Rules.forEach(RuleClass => {
            this.rules.push(new (RuleClass as unknown as AnalysisRuleClass<T, N>)(this.context));
        });
    }

    /**
     * Runs every registered rule over a file's complete AST, in order. Any extra files a rule
     * determines the file now needs go straight into `context.extraFiles` (see `AnalysisRule`) —
     * there's nothing left for this method to aggregate.
     * @param {ASTNode<T, N>[]} nodes - The parsed top-level AST nodes for one file.
     * @returns {void}
     * @throws {ChordError} Whatever the first violated rule throws.
     */
    public analyze (nodes: ASTNode<T, N>[]): void {
        this.rules.forEach(rule => rule.check(nodes));
    }
}
