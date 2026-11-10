import { Analyzer } from "../../chord/Analyzer/Analyzer";
import { AnalysisRuleClass } from "../../chord/Analyzer/AnalysisRule";
import { DisChordNode, DisChordNodeType, DisChordTokenType } from "../types";
import { BindDisChordDeclarationsRule } from "./rules/BindDisChordDeclarationsRule";
import { SingleWholeFileDeclarationRule } from "./rules/SingleWholeFileDeclarationRule";
import { ValidateStartBotRule } from "./rules/ValidateStartBotRule";
import { ValidateEventRule } from "./rules/ValidateEventRule";
import { ValidateCommandRule } from "./rules/ValidateCommandRule";
import { ValidateCollectorRule } from "./rules/ValidateCollectorRule";
import { ValidateButtonsRule } from "./rules/ValidateButtonsRule";
import { ValidateEmbedsRule } from "./rules/ValidateEmbedsRule";
import { RequiresMessageHelperRule } from "./rules/RequiresMessageHelperRule";
import { ValidateMessagesRule } from "./rules/ValidateMessagesRule";
import { RequiresChannelHelperRule } from "./rules/RequiresChannelHelperRule";
import { RequiresModerationHelperRule } from "./rules/RequiresModerationHelperRule";
import { RequiresChannelExtensionsRule } from "./rules/RequiresChannelExtensionsRule";
import { ValidateChannelActionsRule } from "./rules/ValidateChannelActionsRule";
import { ValidateModerationActionsRule } from "./rules/ValidateModerationActionsRule";
import { PatchedMembersRules } from "./rules/PatchedMembersRules";
import { DisChordResolveAwaitedCallsRule } from "./rules/DisChordResolveAwaitedCallsRule";
import { ResolveAwaitedCallsRule } from "../../chord/Analyzer/rules/ResolveAwaitedCallsRule";
import { BindDeclarationsRule } from "../../chord/Analyzer/rules/BindDeclarationsRule";
import { DisChordBindDeclarationsRule } from "./rules/DisChordBindDeclarationsRule";
import { ValidateGeneratedNamesRule } from "./rules/ValidateGeneratedNamesRule";
import { ValidateInjectedNamesRule } from "./rules/ValidateInjectedNamesRule";

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
        ValidateMessagesRule,
        ValidateChannelActionsRule,
        ValidateModerationActionsRule,
        RequiresMessageHelperRule,
        RequiresChannelHelperRule,
        RequiresModerationHelperRule,
        RequiresChannelExtensionsRule,
        ...PatchedMembersRules.build(),

        // last: it reads the imports every rule above inserted
        ValidateGeneratedNamesRule
    ];

    /**
     * @override
     */
    protected override registerRules (): void {
        // command and event bodies get their own scope, declared before chord's rules bind anything.
        this.context.symbolTable.registerScopeOwner(DisChordTokenType.CREAR_COMANDO, { asyncBody: true });
        this.context.symbolTable.registerScopeOwner(DisChordTokenType.EVENTO, { asyncBody: true });

        super.registerRules();

        // Chord's awaited-calls rule is swapped for the dialect's, which also covers `enviar mensaje`,
        // so the context stack is tracked once and not duplicated in a second rule.
        this.replaceRule(ResolveAwaitedCallsRule, new DisChordResolveAwaitedCallsRule(this.context));
        // and so is the one that binds declarations, which also declares what a command and an event put in scope
        this.replaceRule(BindDeclarationsRule, new DisChordBindDeclarationsRule(this.context));

        // the rejection of declaring a name a command or an event defines only needs the tree, and must run before
        // the binding, which would otherwise report the redeclaration first with its own, less specific message
        this.insertRuleBefore(BindDeclarationsRule, new ValidateInjectedNamesRule(this.context));

        DisChordAnalyzer.DisChordRules.forEach(RuleClass => {
            this.rules.push(new RuleClass(this.context));
        });
    }
}
