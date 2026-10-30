import { SharedModule } from "../../../chord/model/SharedModule";
import { LiteralNode, ODBNode, TokenType } from "../../../chord/model/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../../types";
import { userExtensionsModule, userPropertyNames } from "../../corelib";
import { RequiresPatchedMembersRule } from "./RequiresPatchedMembersRule";

/**
 * Inserts the import of the shared runtime module `userExtensionsModule.content`, which patches
 * Seyfert's `User`/`GuildMember` prototypes with the Spanish user-data getters (`usuario.nombre`,
 * `mencion.colorPerfil`, ...), when the file needs them: see `RequiresPatchedMembersRule` for when an
 * access to one of those names counts (and that access by index is not detected).
 *
 * It adds one trigger of its own: any `opcion "usuario"` declaration anywhere in the file. A command
 * option typed this way can be bound to *any* variable name (`mencion`, `objetivo`, ...), so there's no
 * fixed identifier to check by name for that case — presence of the option type itself is the only
 * reliable signal, even at the cost of an unused import on the rare file that declares the option but
 * never actually reads any of its Spanish-named user data.
 */
export class RequiresUserExtensionsRule extends RequiresPatchedMembersRule {
    protected readonly patchedNames: Readonly<Record<string, string>> = userPropertyNames;
    protected readonly module: SharedModule = userExtensionsModule;

    /**
     * @override
     */
    protected override triggers (node: DisChordASTNode): boolean {
        if (node.type !== TokenType.BDO) return false;

        const opcion = (node as unknown as ODBNode<DisChordNodeType, DisChordNode>).blocks['opcion'];

        return opcion?.type === TokenType.LITERAL && (opcion as LiteralNode<DisChordNodeType>).value === 'usuario';
    }
}
