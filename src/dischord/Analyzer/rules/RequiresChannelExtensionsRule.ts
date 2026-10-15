import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
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
    private readonly sharedModules = new SharedModuleImporter(this.context);

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

        this.sharedModules.insert(nodes, { path: channelExtensionsModulePath, content: channelExtensionsModuleContent });
    }
}
