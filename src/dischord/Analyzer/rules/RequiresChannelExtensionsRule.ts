import path from "node:path";
import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { SharedModuleSpecifier } from "../../../chord/Analyzer/SharedModuleSpecifier";
import { ImportNode, LiteralNode, ODBNode, TokenType } from "../../../chord/model/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { channelExtensionsModuleContent, channelExtensionsModulePath } from "../../corelib";

/**
 * Detects, over the complete AST, whether the file can receive a channel object whose Spanish
 * properties (`c.nombre`, `c.tipo`, ...) need the runtime getters of
 * `channelExtensionsModuleContent`, and if so inserts a synthetic `ImportNode` for it — the same
 * lowering step `RequiresUserExtensionsRule` does for users.
 *
 * Two triggers, as there:
 * - Any channel block (`crear`, `editar`, `borrar`, `obtener canal`, `listar canales`): its result
 *   is a channel, or a list of them, kept in a variable of any name.
 * - Any `opcion "canal"` declaration: a command option typed so can be bound to any variable name.
 *
 * The implicit `canal` identifier does not need it: its members are rewritten at compile time.
 */
export class RequiresChannelExtensionsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        let needsExtensions = false;

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (needsExtensions) return;

            if (current.type === DisChordTokenType.ACCION_CANAL) {
                needsExtensions = true;
                return;
            }

            if (current.type === TokenType.BDO) {
                const opcion = (current as unknown as ODBNode<DisChordNodeType, DisChordNode>).blocks['opcion'];
                if (opcion?.type === TokenType.LITERAL && (opcion as LiteralNode<DisChordNodeType>).value === 'canal') needsExtensions = true;
            }
        }));

        if (!needsExtensions) return;

        const importNode: ImportNode<DisChordNodeType> = {
            type: TokenType.Importar,
            identificators: [],
            isDestructured: false,
            path: SharedModuleSpecifier.of(this.context, channelExtensionsModulePath),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.distDir, channelExtensionsModulePath), channelExtensionsModuleContent);
    }
}
