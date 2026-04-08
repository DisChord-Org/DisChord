import { ButtonStyles, DisChordASTNode, ODBNode } from "../../../types";
import { DisChordGenerator } from "../../generator";
import { SubGenerator } from "../../subgenerator";

/**
 * Generator class responsible for generating code related to message buttons in DisChord.
 */
export default class ButtonGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "boton";

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
    generateIfNodeExists (node: ODBNode | undefined): string {
        if (!node) return '';

        const button = this.getODBProperty(node, 'boton');

        return button ? `, components: [ new ActionRow().setComponents([ ${this.generate(button)} ]) ]` : '';
    }

    /**
     * Entry point for button code generation.
     * Maps the BDO (Object Data Block) properties to their corresponding Button builder methods.
     * @param node The ODBNode containing button definitions.
     * @throws {Error} If the node is not a BDO or if mandatory properties (id, etiqueta, estilo) are missing.
     * @returns A string representing the instantiation and configuration of a new Button.
     */
    generate (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new Error(`Se esperaba un BDO, se recibió '${node.type}'`);

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
    private resolveCustomId (node: ODBNode): string {
        const customId = this.visitIfExists(
            this.getODBProperty(node, 'id')
        );

        if (!customId) throw new Error('Se debe especificar una id en el botón');

        return `.setCustomId(${customId})`;
    }

    /**
     * Resolves the 'etiqueta' property and maps it to setLabel.
     * @private
     * @throws {Error} If the 'etiqueta' property is missing.
     */
    private resolveLabel (node: ODBNode): string {
        const label = this.visitIfExists(
            this.getODBProperty(node, 'etiqueta')
        );

        if (!label) throw new Error('Se debe especificar una etiqueta en el botón');

        return `.setLabel(${label})`;
    }

    /**
     * Resolves the 'estilo' property using the ButtonStyles mapping.
     * @private
     * @throws {Error} If the 'estilo' property is missing or if the style value is not recognized.
     */
    private resolveStyle (node: ODBNode): string {
        const style = this.visitIfExists(
            this.getODBProperty(node, 'estilo')
        );
        
        if (!style) throw new Error('Se debe especificar el estilo en el botón');
        if (!(style in ButtonStyles)) throw new Error(`Estilo inválido: '${style}'`);

        const ButtonStyle = ButtonStyles[style as keyof typeof ButtonStyles];


        return `.setStyle(${ButtonStyle})`;
    }

    /**
     * Resolves the optional 'emoji' property.
     * @private
     * @returns The generated setEmoji call or an empty string if not defined.
     */
    private resolveEmoji (node: ODBNode): string {
        const emoji = this.visitIfExists(
            this.getODBProperty(node, 'emoji')
        );

        if (!emoji) return '';

        return `.setEmoji(${emoji})`;
    }
}