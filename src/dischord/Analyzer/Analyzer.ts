import { Analyzer } from "../../chord/Analyzer/Analyzer";
import { DisChordNode, DisChordNodeType } from "../types";
import { CompilationContext } from "../../cli/commands/CompileCommand";
import { BindDisChordDeclarationsRule } from "./rules/BindDisChordDeclarationsRule";
import { SingleWholeFileDeclarationRule } from "./rules/SingleWholeFileDeclarationRule";
import { RequiresMessageHelperRule } from "./rules/RequiresMessageHelperRule";

/**
 * DisChord's semantic analysis rules, run over a file's complete AST between parsing and
 * generation. See `Analyzer` for the general phase contract — this subclass calls `super(context)`
 * to keep chord's own rules, then pushes its own on top; the actual checks live in `./rules`.
 */
export class DisChordAnalyzer extends Analyzer<DisChordNodeType, DisChordNode> {
    /**
     * @param context - The active compilation context (symbol table, project paths, etc.).
     */
    constructor (context: CompilationContext<DisChordNodeType>) {
        super(context);

        // Pass 2 ("Variables"), dischord's own declarations: comando/evento/encender bot.
        this.rules.push(new BindDisChordDeclarationsRule(context));

        this.rules.push(new SingleWholeFileDeclarationRule(context));
        this.rules.push(new RequiresMessageHelperRule(context));
    }
}
