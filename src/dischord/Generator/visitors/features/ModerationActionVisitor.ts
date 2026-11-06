import { ModerationAction, ModerationActionNode, ModerationProperty, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { VisitorHelpers } from "../VisitorHelpers";
import { TokenTypeUnion } from "../../../../chord/model/types";
import { ModerationActionSchemas } from "../../constants/schemas";
import { moderationHelperNames } from "../../../corelib";

/**
 * Generator class for the moderation blocks (`banear miembro`, `desbanear usuario` and `expulsar miembro`):
 * each becomes an `await` of the matching helper of the shared `moderation` runtime module, which holds
 * the barriers. Nothing here decides what is allowed: it only passes on what the block says.
 */
export default class ModerationActionVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.ACCION_MODERACION;

    /**
     * @param node The ModerationActionNode representing the action to generate code for.
     * @returns The generated `await` expression.
     */
    visit (node: ModerationActionNode): string {
        const resolver = VisitorHelpers.resolverFor(this.parent);
        const properties = resolver.resolve(node.object, ModerationActionSchemas[node.action]);
        const helper = moderationHelperNames[node.action];
        const guild = node.object.blocks[ModerationProperty.Servidor] ? properties[ModerationProperty.Servidor] : node.guild!;
        const common = `ctx, ${properties[ModerationProperty.Usuario]}, ${guild}, ${properties[ModerationProperty.Razon]}`;

        return node.action === ModerationAction.Banear
            ? `await ${helper}(${common}, ${properties[ModerationProperty.BorrarMensajes]})`
            : `await ${helper}(${common})`;
    }
}
