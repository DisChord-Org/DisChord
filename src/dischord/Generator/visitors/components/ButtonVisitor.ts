import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { ButtonStyles, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { DisChordGenerator } from "../../Generator";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";

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
     * @param parent The context of the MessageGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Helper method to generate the ActionRow and Button structure by searching 
     * for the 'boton' property within a given ODBNode.
     * * @param node The parent ODBNode that may contain a 'boton' definition.
     * @returns A string representing the 'components array or an empty string if no button property is defined.
     */
    visitIfNodeExists (node: DisChordODBNode | undefined): string {
        if (!node) return '';

        const button = this.parent.get(BDOVisitor).getODBProperty(node, 'boton');

        return button ? `, components: [ new ActionRow().setComponents([ ${this.visit(button)} ]) ]` : '';
    }

    /**
     * Entry point for button code generation.
     * Maps the BDO (Object Data Block) properties to their corresponding Button builder methods.
     * @param node The ODBNode containing button definitions.
     * @throws {Error} If the node is not a BDO or if mandatory properties (id, etiqueta, estilo) are missing.
     * @returns A string representing the instantiation and configuration of a new Button.
     */
    visit (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se esperaba un BDO, se recibió '${node.type}'`,
            location: node.location
        }).format();

        const ResolvedCustomId = this.resolveCustomId(node);
        const ResolvedLabel = this.resolveLabel(node);
        const ResolvedStyle = this.resolveStyle(node);
        const ResolvedEmoji = this.resolveEmoji(node);

        return `
            new Button()
                ${ResolvedCustomId}
                ${ResolvedLabel}
                ${ResolvedStyle}
                ${ResolvedEmoji}
        `;
    }

    /**
     * Resolves the 'id' property and maps it to setCustomId.
     * @private
     * @throws {Error} If the 'id' property is missing.
     */
    private resolveCustomId (node: DisChordODBNode): string {
        const customId = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'id')
        );

        if (!customId) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se debe especificar una id en el botón`,
            location: node.location
        }).format();

        return `.setCustomId(${customId})`;
    }

    /**
     * Resolves the 'etiqueta' property and maps it to setLabel.
     * @private
     * @throws {Error} If the 'etiqueta' property is missing.
     */
    private resolveLabel (node: DisChordODBNode): string {
        const label = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'etiqueta')
        );

        if (!label) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se debe especificar una etiqueta en el botón`,
            location: node.location
        }).format();

        return `.setLabel(${label})`;
    }

    /**
     * Resolves the 'estilo' property using the ButtonStyles mapping.
     * @private
     * @throws {Error} If the 'estilo' property is missing or if the style value is not recognized.
     */
    private resolveStyle (node: DisChordODBNode): string {
        const style = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'estilo')
        );
        
        if (!style) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se debe especificar el estilo en el botón`,
            location: node.location
        }).format();

        const SlicedStyle = style.slice(1, -1);

        if (!(SlicedStyle in ButtonStyles)) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Estilo inválido: '${SlicedStyle}'`,
            location: node.location
        }).format();

        const ButtonStyle = ButtonStyles[SlicedStyle as keyof typeof ButtonStyles];

        return `.setStyle(${ButtonStyle})`;
    }

    /**
     * Resolves the optional 'emoji' property.
     * @private
     * @returns The generated setEmoji call or an empty string if not defined.
     */
    private resolveEmoji (node: DisChordODBNode): string {
        const emoji = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'emoji')
        );

        if (!emoji) return '';

        return `.setEmoji(${emoji})`;
    }
}