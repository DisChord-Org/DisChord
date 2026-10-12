import { ChannelAction, ChannelActionNode, ChannelProperty, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { fieldKeys, JSFallback } from "../../../../chord/BDOSchema";
import { TokenTypeUnion } from "../../../../chord/types";
import { ChannelActionSchemas } from "../../constants/schemas";
import { channelHelperNames } from "../../../corelib";

/**
 * Generator class for `crear canal`, `editar canal` and `borrar canal`: each becomes an `await` of
 * the matching helper of the shared `channels` runtime module.
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
        const helper = channelHelperNames[node.action];

        switch (node.action) {
            case ChannelAction.Crear:
                return `await ${helper}(ctx, ${this.guild(node, properties)}, ${this.body(node, properties)})`;
            case ChannelAction.Editar:
                return `await ${helper}(ctx, ${properties[ChannelProperty.Canal]}, ${this.body(node, properties)}, ${properties[ChannelProperty.Razon]}, ${node.guild})`;
            case ChannelAction.Borrar:
                return `await ${helper}(ctx, ${properties[ChannelProperty.Canal]}, ${properties[ChannelProperty.Razon]}, ${node.guild})`;
        }
    }

    /**
     * The server to create in: the one the block names, or the context's own.
     * @private
     */
    private guild (node: ChannelActionNode, properties: Record<string, string>): string {
        return node.object.blocks[ChannelProperty.Servidor] ? properties[ChannelProperty.Servidor] : node.guild!;
    }

    /**
     * The API body: the fields of the schema that go in it, and only the ones the block declared.
     * @private
     */
    private body (node: ChannelActionNode, properties: Record<string, string>): string {
        const entries = ChannelActionSchemas[node.action].fields
            .filter(field => field.output !== undefined)
            .map(field => ({ output: field.output!, value: properties[fieldKeys(field.key)[0]] }))
            .filter(({ value }) => value !== undefined && value !== JSFallback.Undefined)
            .map(({ output, value }) => `${output}: ${value}`);

        return `{ ${entries.join(', ')} }`;
    }
}
