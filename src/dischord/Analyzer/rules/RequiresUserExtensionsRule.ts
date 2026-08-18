import path from "node:path";
import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { buildSharedModuleImportSpecifier } from "../../../chord/Analyzer/sharedModulePath";
import { ASTNode, ImportNode, LiteralNode, ODBNode, TokenType } from "../../../chord/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../../types";
import { userExtensionsModuleContent, userExtensionsModulePath, userPropertyNames } from "../../core.lib";

/**
 * Detects, over the *complete* AST, whether the file needs the Spanish user-data getters
 * (`usuario.nombre`, `mencion.colorPerfil`, ...) — patched onto Seyfert's `User`/`GuildMember`
 * prototypes by the shared runtime module `userExtensionsModuleContent` — and if so inserts a
 * real, synthetic `ImportNode` for it, the same "lowering" step `RequiresMessageHelperRule` and
 * `RequiresConsoleRuntimeRule` already do for their own shared modules.
 *
 * Two independent triggers, both needed:
 * - The literal `usuario` identifier (the implicit user parameter every event/command handler
 *   gets) accessed with one of the known Spanish property names. Scoped to this specific
 *   identifier — matching by property name alone would also fire on unrelated objects that
 *   happen to have a `.nombre`/`.id` field of their own (e.g. `esta.nombre` on a plain class).
 * - Any `opcion "usuario"` declaration anywhere in the file. A command option typed this way can
 *   be bound to *any* variable name (`mencion`, `objetivo`, ...), so there's no fixed identifier
 *   to check by name for that case — presence of the option type itself is the only reliable
 *   signal, even at the cost of an unused import on the rare file that declares the option but
 *   never actually reads any of its Spanish-named user data.
 */
export class RequiresUserExtensionsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        let needsUserExtensions = false;

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (needsUserExtensions) return;

            if (current.type === TokenType.ACCESO) {
                const access = current as unknown as { object: ASTNode<DisChordNodeType, DisChordNode>; property: string };
                const objName = access.object.type === TokenType.IDENTIFICADOR
                    ? (access.object as unknown as { value: string }).value
                    : null;

                if (objName === 'usuario' && access.property in userPropertyNames) needsUserExtensions = true;
                return;
            }

            if (current.type === TokenType.BDO) {
                const opcion = (current as unknown as ODBNode<DisChordNodeType, DisChordNode>).blocks['opcion'];
                if (opcion?.type === TokenType.LITERAL && (opcion as LiteralNode<DisChordNodeType>).value === 'usuario') {
                    needsUserExtensions = true;
                }
            }
        }));

        if (!needsUserExtensions) return;

        const importNode: ImportNode<DisChordNodeType> = {
            type: TokenType.Importar,
            identificators: [],
            isDestructured: false,
            path: buildSharedModuleImportSpecifier(this.context, userExtensionsModulePath),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        this.context.extraFiles.set(path.join(this.context.projectRoot, 'dist', userExtensionsModulePath), userExtensionsModuleContent);
    }
}
