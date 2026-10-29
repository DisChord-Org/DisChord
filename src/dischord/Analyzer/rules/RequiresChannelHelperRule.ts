import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
import { ChannelActionNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { channelHelperNames, channelsModule } from "../../corelib";

/**
 * Detects, over the complete AST, which channel actions the file performs and inserts a real,
 * synthetic `ImportNode` for those helpers of the shared `channels` module at the front of
 * `nodes` — the same lowering step `RequiresMessageHelperRule` does for `createMessage` — so
 * `ChannelActionVisitor` never has to decide whether to import them.
 */
export class RequiresChannelHelperRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly sharedModules = new SharedModuleImporter(this.context);

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        const used = new Set<string>();

        this.walk(nodes, current => {
            if (current.type === DisChordTokenType.ACCION_CANAL) used.add(channelHelperNames[(current as ChannelActionNode).action]);
        });

        if (used.size === 0) return;

        this.sharedModules.insert(nodes, channelsModule, [ ...used ]);
    }
}
