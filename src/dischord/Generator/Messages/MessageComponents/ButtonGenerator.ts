import { ButtonStyles, MessageButtonNode, ODBNode } from "../../../types";
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
     * Generates code for a MessageButtonNode, which represents a Button in DisChord.
     * @param node The MessageButtonNode representing the button to generate code for.
     * @returns The generated AST for the button component.
     * @throws {Error} - If the button style is invalid.
     */
    generate (node: ODBNode): string {
        if (node.type != 'BDO') throw new Error(`Se esperaba un BDO, se recibió '${node.type}'`);

        const ResolvedCustomId = this.resolveCustomId(node);
        const ResolvedLabel = this.resolveLabel(node);
        const ResolvedStyle = this.resolveStyle(node);
        const ResolvedEmoji = this.resolveEmoji(node);

        return `
            new Button()
                ${ResolvedCustomId}
                ${ResolvedLabel}
                .setStyle(${ButtonStyle})
                ${node.emoji? `.setEmoji(${this.ctx.MessageGeneratorContext.visit(node.emoji)})` : ''}
        `;
    }

    private resolveCustomId (node: ODBNode): string {
        const customId = this.visitIfExists(
            this.getODBProperty(node, 'id')
        );

        if (!customId) throw new Error('La id de un botón no puede ser indefinido');

        return `.setCustomId(${customId})`;
    }

    private resolveLabel (node: ODBNode): string {
        const label = this.visitIfExists(
            this.getODBProperty(node, 'etiqueta')
        );

        if (!label) throw new Error('Se debe especificar una etiqueta en el botón');

        return `.setLabel(${label})`;
    }

    private resolveStyle (node: ODBNode): string {
        const style = this.visitIfExists(
            this.getODBProperty(node, 'estilo')
        );
        
        if (!label) throw new Error('Se debe especificar una etiqueta en el botón');
        
        const StyleString: string = this.visit(node.style).slice(1, -1);
        if (!(StyleString in ButtonStyles)) throw new Error(`Estilo inválido: '${StyleString}'`);
        const ButtonStyle = ButtonStyles[StyleString as keyof typeof ButtonStyles];


        return `.setLabel(${label})`;
    }
}