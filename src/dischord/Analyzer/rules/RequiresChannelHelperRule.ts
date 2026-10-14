import path from "node:path";
import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { SharedModuleSpecifier } from "../../../chord/Analyzer/SharedModuleSpecifier";
import { ImportNode, TokenType } from "../../../chord/types";
import { ChannelActionNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { channelHelperNames, channelsModuleContent, channelsModulePath } from "../../corelib";

/**
 * Detects, over the complete AST, which channel actions the file performs and inserts a real,
 * synthetic `ImportNode` for those helpers of the shared `channels` module at the front of
 * `nodes` — the same lowering step `RequiresMessageHelperRule` does for `createMessage` — so
 * `ChannelActionVisitor` never has to decide whether to import them.
 */
export class RequiresChannelHelperRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        const used = new Set<string>();

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.ACCION_CANAL) used.add(channelHelperNames[(current as ChannelActionNode).action]);
        }));

        if (used.size === 0) return;

        const importNode: ImportNode<DisChordNodeType> = {
            type: TokenType.Importar,
            identificators: [ ...used ],
            isDestructured: true,
            path: SharedModuleSpecifier.of(this.context, channelsModulePath),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.distDir, channelsModulePath), channelsModuleContent);
    }
}
