import { Analyzer } from "../../chord/Analyzer/Analyzer";
import { AnalysisRuleClass } from "../../chord/Analyzer/AnalysisRule";
import { DisChordNode, DisChordNodeType } from "../types";
import { BindDisChordDeclarationsRule } from "./rules/BindDisChordDeclarationsRule";
import { SingleWholeFileDeclarationRule } from "./rules/SingleWholeFileDeclarationRule";
import { ValidateStartBotRule } from "./rules/ValidateStartBotRule";
import { ValidateEventRule } from "./rules/ValidateEventRule";
import { ValidateCommandRule } from "./rules/ValidateCommandRule";
import { ValidateCollectorRule } from "./rules/ValidateCollectorRule";
import { ValidateButtonsRule } from "./rules/ValidateButtonsRule";
import { ValidateEmbedsRule } from "./rules/ValidateEmbedsRule";
import { RequiresMessageHelperRule } from "./rules/RequiresMessageHelperRule";
import { RequiresUserExtensionsRule } from "./rules/RequiresUserExtensionsRule";

/**
 * DisChord's semantic analysis rules, run over a file's complete AST between parsing and
 * generation. See `Analyzer` for the general phase contract — this subclass overrides
 * {@link registerRules} to keep chord's own rules (via `super.registerRules()`) and push its own
 * on top, mirroring `DisChordParser.registerInstances`/`DisChordGenerator`'s own static-registry
 * override; the actual checks live in `./rules`.
 */
export class DisChordAnalyzer extends Analyzer<DisChordNodeType, DisChordNode> {
    /**
     * DisChord's own analysis rules, in the order they must run after chord's.
     * @private
     * @static
     */
    private static readonly DisChordRules: AnalysisRuleClass<DisChordNodeType, DisChordNode>[] = [
        // Pass 2 ("Variables"), dischord's own declarations: comando/evento/encender bot.
        BindDisChordDeclarationsRule,

        SingleWholeFileDeclarationRule,
        ValidateStartBotRule,
        ValidateEventRule,
        ValidateCommandRule,
        ValidateCollectorRule,
        ValidateButtonsRule,
        ValidateEmbedsRule,
        RequiresMessageHelperRule,
        RequiresUserExtensionsRule
    ];

    /**
     * @override
     */
    protected override registerRules (): void {
        super.registerRules();

        DisChordAnalyzer.DisChordRules.forEach(RuleClass => {
            this.rules.push(new RuleClass(this.context));
        });
    }
}
