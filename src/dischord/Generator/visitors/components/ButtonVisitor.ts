import { DisChordError, ErrorLevel } from "../../../../errors/ChordError";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";
import ActionRowVisitor from "./ActionRowVisitor";
import { ButtonSchema } from "../../constants/schemas";

/**
 * Generator class responsible for generating code related to message buttons in DisChord.
 */
export default class ButtonVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = undefined;

    /**
     * Helper method to generate the ActionRow and Button structure by searching
     * for the 'boton' property within a given ODBNode.
     *
     * The property's value can be a single button (inline BDO or a reference to an already
     * declared one, e.g. `boton Confirmar`), a flat list of several, or a list of lists for
     * manually laid-out rows — see `ActionRowVisitor.visit`, which owns turning any of
     * those into the actual `new ActionRow()...` call(s), including Discord's 5-per-row limit.
     * @param node The parent ODBNode that may contain a 'boton' definition.
     * @returns A string representing the 'components array or an empty string if no button property is defined.
     */
    visitIfNodeExists (node: DisChordODBNode | undefined): string {
        if (!node) return '';

        const button = this.parent.get(BDOVisitor).getODBProperty(node, 'boton');
        if (!button) return '';

        const rows = this.parent.get(ActionRowVisitor).visit(button);

        return `, components: [ ${rows} ] `;
    }

    /**
     * Entry point for button code generation.
     * Maps the BDO (Object Data Block) properties to their corresponding Button builder methods.
     * `id`/`etiqueta`/`estilo` are resolved straight from {@link ButtonSchema} — the same schema
     * the Analyzer's `ValidateButtonsRule` already validated this BDO against.
     * @param node The ODBNode containing button definitions.
     * @throws {DisChordError} If the node is not a BDO (an internal consistency assertion — every
     * caller of `visit` already confirmed this itself, so a malformed `.chord` file can never
     * reach this check; see `ValidateCallTargetsRule` for why this kind of check stays here rather
     * than moving to the Analyzer).
     * @returns A string representing the instantiation and configuration of a new Button.
     */
    visit (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se esperaba un BDO, se recibió '${node.type}'`,
            location: node.location
        }).format();

        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const button = resolver.resolve(node, ButtonSchema);
        const ResolvedEmoji = button['emoji'] ? `.setEmoji(${button['emoji']})` : '';

        return `
            new Button()
                .setCustomId(${button['id']})
                .setLabel(${button['etiqueta']})
                .setStyle(${button['estilo']})
                ${ResolvedEmoji}
        `;
    }
}
