import { Test } from "../../../Test";
import { Analyzer } from "../../../../src/chord/Analyzer/Analyzer";
import { DisChordAnalyzer } from "../../../../src/dischord/Analyzer/Analyzer";
import { DisChordCompilationContext } from "../../../../src/cli/DisChordCompilationContext";
import { FileSystem } from "../../../../src/utils/FileSystem";
import { DisChordNode, DisChordNodeType } from "../../../../src/dischord/types";

/** The analyzers, with the list of their rules in the open. */
class ChordRules extends Analyzer<DisChordNodeType, DisChordNode> {
    public names (): string[] {
        return this.rules.map(rule => rule.constructor.name);
    }
}

class DisChordRules extends DisChordAnalyzer {
    public names (): string[] {
        return this.rules.map(rule => rule.constructor.name);
    }
}

/**
 * @class RuleOrderTest
 * @description Pins the final list of analysis rules of chord and of dischord, in the order they run: each rule
 * reads what the ones before it decided, so adding, moving or swapping one has to be a visible change here.
 */
export class RuleOrderTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Analyzer Rule Order - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to run the rules of the analyzers in the order they are pinned in";

    private static readonly Chord: readonly string[] = [
        'ValidateStatementPlacementRule',
        'ValidateDeclarationNamesRule',
        'BindImportsRule',
        'ValidateImportTargetsRule',
        'BindDeclarationsRule',
        'ValidateClassHierarchyRule',
        'ValidateTypeAnnotationsRule',
        'ValidateKnownNamesRule',
        'ValidateRangeCallsRule',
        'ResolveVariableTypesRule',
        'ValidateNoValueUsesRule',
        'ValidateCallTargetsRule',
        'ValidateAssignmentTypesRule',
        'ValidateIndexAccessRule',
        'ValidateReturnTypesRule',
        'ValidateCallArgumentsRule',
        'ValidateKnownMembersRule',
        'ResolveAwaitedCallsRule',
        'ResolveDispatchedCallsRule',
        'ResolveMemberAccessesRule',
        'MarkInterpolatedBooleansRule',
        'RequiresConsoleRuntimeRule',
        'RequiresRuntimeHelpersRule'
    ];

    /** Chord's list with the dialect's swaps and insertions, then its own rules. */
    private static readonly DisChord: readonly string[] = [
        'ValidateStatementPlacementRule',
        'ValidateDeclarationNamesRule',
        'BindImportsRule',
        'ValidateImportTargetsRule',
        'ValidateInjectedNamesRule',
        'BindHandlerScopeRule',
        'ValidateClassHierarchyRule',
        'ValidateTypeAnnotationsRule',
        'ValidateKnownNamesRule',
        'ValidateRangeCallsRule',
        'ResolveVariableTypesRule',
        'ValidateNoValueUsesRule',
        'ValidateCallTargetsRule',
        'ValidateAssignmentTypesRule',
        'ValidateIndexAccessRule',
        'ValidateReturnTypesRule',
        'ValidateCallArgumentsRule',
        'ValidateKnownMembersRule',
        'DisChordResolveAwaitedCallsRule',
        'ResolveDispatchedCallsRule',
        'ResolveMemberAccessesRule',
        'MarkInterpolatedBooleansRule',
        'RequiresConsoleRuntimeRule',
        'RequiresRuntimeHelpersRule',
        'BindComponentDeclarationsRule',
        'SingleWholeFileDeclarationRule',
        'ValidateHandlerFolderRule',
        'ValidateStartBotRule',
        'ValidateEventRule',
        'ValidateCommandRule',
        'ValidateCollectorRule',
        'ValidateButtonsRule',
        'ValidateEmbedsRule',
        'ValidateMessagesRule',
        'ValidateChannelActionsRule',
        'ValidateModerationActionsRule',
        'RequiresMessageHelperRule',
        'RequiresChannelHelperRule',
        'RequiresModerationHelperRule',
        'RequiresChannelExtensionsRule',
        'RequiresUserExtensionsRule',
        'RequiresMessageExtensionsRule',
        'ValidateGeneratedNamesRule'
    ];

    /**
     * Not a comparison with a snapshot: it builds both analyzers and reads their lists.
     * @override
     */
    protected override async run (): Promise<void> {
        const create = () => DisChordCompilationContext.create(FileSystem.configure(this.fixturePath));

        this.expect(new ChordRules(create()).names(), RuleOrderTest.Chord, 'chord');
        this.expect(new DisChordRules(create()).names(), RuleOrderTest.DisChord, 'dischord');
    }

    private expect (actual: string[], expected: readonly string[], label: string): void {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`The rules of ${label} are not the pinned ones.\nExpected: ${expected.join(', ')}\nActual:   ${actual.join(', ')}`);
        }
    }
}
