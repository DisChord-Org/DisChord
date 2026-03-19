import { ButtonStyles, MessageButtonNode } from "../../../types";
import MessageGenerator from "../MessageGenerator";

/**
 * Generator class responsible for generating code related to message buttons in DisChord.
 */
export default class ButtonGenerator {
    /**
     * @param ctx The context of the MessageGenerator.
     */
    constructor (private ctx: MessageGenerator) {}

    /**
     * Generates code for a MessageButtonNode, which represents a Button in DisChord.
     * @param node The MessageButtonNode representing the button to generate code for.
     * @returns The generated AST for the button component.
     * @throws {Error} - If the button style is invalid.
     */
    generate (node: MessageButtonNode): string {
        const StyleString: string = this.ctx.MessageGeneratorContext.visit(node.style).slice(1, -1);
        if (!(StyleString in ButtonStyles)) throw new Error(`Estilo inválido: '${StyleString}'`);
        const ButtonStyle = ButtonStyles[StyleString as keyof typeof ButtonStyles];

        return `
            new Button()
                .setCustomId(${this.ctx.MessageGeneratorContext.visit(node.id)})
                .setLabel(${this.ctx.MessageGeneratorContext.visit(node.label)})
                .setStyle(${ButtonStyle})
                ${node.emoji? `.setEmoji(${this.ctx.MessageGeneratorContext.visit(node.emoji)})` : ''}
        `;
    }
}