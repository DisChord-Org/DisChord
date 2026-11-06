import { AnalysisRuleClass } from "../../../chord/Analyzer/AnalysisRule";
import { SharedModule } from "../../../chord/model/SharedModule";
import { patchedExtensions } from "../../corelib";
import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../../types";
import { NodePredicates } from "../NodePredicates";
import { RequiresPatchedMembersRule } from "./RequiresPatchedMembersRule";

/**
 * The rules that insert the import of a patched-extensions module: one per entry of `patchedExtensions`
 * (`RequiresUserExtensionsRule`, `RequiresMessageExtensionsRule`, ...). See `RequiresPatchedMembersRule`.
 */
export class PatchedMembersRules {
    /**
     * @returns {AnalysisRuleClass<DisChordNodeType, DisChordNode>[]} The rule classes, in the order of the list.
     */
    public static build (): AnalysisRuleClass<DisChordNodeType, DisChordNode>[] {
        return patchedExtensions.map(({ name, patchedNames, module, optionType }) => {
            const className = `Requires${name}ExtensionsRule`;

            return {
                [className]: class extends RequiresPatchedMembersRule {
                    protected readonly patchedNames: Readonly<Record<string, string>> = patchedNames;
                    protected readonly module: SharedModule = module;

                    /**
                     * @override
                     */
                    protected override triggers (node: DisChordASTNode): boolean {
                        return optionType !== undefined && NodePredicates.declaresOptionType(node, optionType);
                    }
                }
            }[className];
        });
    }
}
