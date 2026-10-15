import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
import { LiteralNode, ODBNode, TokenType } from "../../../chord/model/types";
import { isAccessNode, isIdentificatorNode } from "../../../chord/ast.guards";
import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../../types";
import { userExtensionsModule, userPropertyNames } from "../../corelib";

/**
 * Detects, over the *complete* AST, whether the file needs the Spanish user-data getters
 * (`usuario.nombre`, `mencion.colorPerfil`, ...) — patched onto Seyfert's `User`/`GuildMember`
 * prototypes by the shared runtime module `userExtensionsModule.content` — and if so inserts a
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
    private readonly sharedModules = new SharedModuleImporter(this.context);

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        let needsUserExtensions = false;

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (needsUserExtensions) return;

            if (isAccessNode(current)) {
                const objName = isIdentificatorNode(current.object) ? current.object.value : null;

                if (objName === 'usuario' && Object.prototype.hasOwnProperty.call(userPropertyNames, current.property)) needsUserExtensions = true;
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

        this.sharedModules.insert(nodes, userExtensionsModule);
    }
}
