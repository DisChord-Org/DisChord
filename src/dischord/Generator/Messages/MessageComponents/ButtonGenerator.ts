import { ButtonStyles, MessageButtonNode } from "../../../types";
import MessageGenerator from "../MessageGenerator";

export default class ButtonGenerator {
    constructor (private ctx: MessageGenerator) {}

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