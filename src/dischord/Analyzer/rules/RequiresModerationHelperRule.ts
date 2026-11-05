import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
import { ModerationActionNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { moderationHelperNames, moderationModule } from "../../corelib";

/**
 * Detects, over the complete AST, which moderation actions the file performs and inserts a real,
 * synthetic `ImportNode` for those helpers of the shared `moderation` module at the front of
 * `nodes` — the same lowering step `RequiresChannelHelperRule` does for the channel actions — so
 * `ModerationActionVisitor` never has to decide whether to import them.
 */
export class RequiresModerationHelperRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly sharedModules = new SharedModuleImporter(this.context);

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        const used = new Set<string>();

        this.walk(nodes, current => {
            if (current.type === DisChordTokenType.ACCION_MODERACION) used.add(moderationHelperNames[(current as ModerationActionNode).action]);
        });

        if (used.size === 0) return;

        this.sharedModules.insert(nodes, moderationModule, [ ...used ]);
    }
}
