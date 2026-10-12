import { ChannelAction, ChannelActionNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { JSFallback } from "../../../../chord/BDOSchema";
import { TokenTypeUnion } from "../../../../chord/types";
import { ChannelActionSchemas } from "../../constants/schemas";

/**
 * Maps each channel property's DisChord name to the Discord API field it fills. A property is left
 * out of the generated body when the block does not declare it.
 */
const ChannelBodyFields: Readonly<Record<string, string>> = {
    nombre: 'name',
    tipoCanal: 'type',
    tema: 'topic',
    nsfw: 'nsfw',
    categoria: 'parent_id',
    posicion: 'position',
    modoLento: 'rate_limit_per_user',
    bitrate: 'bitrate',
    limiteUsuarios: 'user_limit'
};

/**
 * Generator class for `crear canal`, `editar canal` and `borrar canal`: each becomes an `await` of
 * the matching call of the shared `channels` runtime module.
 */
export default class ChannelActionVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.ACCION_CANAL;

    /**
     * @param node The ChannelActionNode representing the action to generate code for.
     * @returns The generated `await` expression.
     */
    visit (node: ChannelActionNode): string {
        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const properties = resolver.resolve(node.object, ChannelActionSchemas[node.action]);
        const body = this.body(properties);

        switch (node.action) {
            case ChannelAction.Crear:
                return `await createChannel(ctx, ${properties['servidor']}, ${body})`;
            case ChannelAction.Editar:
                return `await editChannel(ctx, ${properties['canal']}, ${body}, ${properties['razon']})`;
            case ChannelAction.Borrar:
                return `await deleteChannel(ctx, ${properties['canal']}, ${properties['razon']})`;
        }
    }

    /**
     * The API body: only the properties the block declared.
     * @private
     */
    private body (properties: Record<string, string>): string {
        const entries = Object.entries(ChannelBodyFields)
            .filter(([ key ]) => properties[key] !== undefined && properties[key] !== JSFallback.Undefined)
            .map(([ key, apiField ]) => `${apiField}: ${properties[key]}`);

        return `{ ${entries.join(', ')} }`;
    }
}
