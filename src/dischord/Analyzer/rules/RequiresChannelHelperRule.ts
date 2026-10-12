import path from "node:path";
import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { buildSharedModuleImportSpecifier } from "../../../chord/Analyzer/sharedModulePath";
import { ImportNode, TokenType } from "../../../chord/types";
import { ChannelAction, ChannelActionNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { channelsModuleContent, channelsModulePath } from "../../corelib";

/**
 * The name `ChannelActionVisitor` calls for each action, so the import brings exactly the ones
 * the file uses.
 */
const HelperOf: Readonly<Record<ChannelAction, string>> = {
    [ChannelAction.Crear]: 'createChannel',
    [ChannelAction.Editar]: 'editChannel',
    [ChannelAction.Borrar]: 'deleteChannel'
};

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
            if (current.type === DisChordTokenType.ACCION_CANAL) used.add(HelperOf[(current as ChannelActionNode).action]);
        }));

        if (used.size === 0) return;

        const importNode: ImportNode<DisChordNodeType> = {
            type: TokenType.Importar,
            identificators: [ ...used ],
            isDestructured: true,
            path: buildSharedModuleImportSpecifier(this.context, channelsModulePath),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.distDir, channelsModulePath), channelsModuleContent);
    }
}
