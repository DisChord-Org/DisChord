import { DisChordParser } from "../parser";
import { MessageBodyNode, MessageNode } from "../types";

export default class MessageParser {
    constructor (private ctx: DisChordParser) {}

    parse (): MessageNode {
        this.ctx.consume('IDENTIFICADOR');
        this.ctx.consume('L_BRACE');

        const body: MessageBodyNode[] = [];

        while (this.ctx.peek().type !== 'R_BRACE') {
            const token = this.ctx.peek();

            switch (token.value) {
                case 'contenido':
                    this.ctx.consume('IDENTIFICADOR');
                    const content = this.ctx.parsePrimary();

                    const contentNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'contenido',
                        content
                    };

                    body.push(contentNode);
                    break;
                case 'canal':
                    this.ctx.consume('IDENTIFICADOR');
                    const channel = this.ctx.parsePrimary();

                    const channelNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'canal',
                        channel
                    };

                    body.push(channelNode);
                    break;
                case 'embed':
                    this.ctx.consume('IDENTIFICADOR');
                    const embed = this.ctx.parseEmbedCreation();
        
                    const embedNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'embed',
                        embed
                    };
        
                    body.push(embedNode);
                    break;
                case 'boton':
                    this.ctx.consume('IDENTIFICADOR');
                    const ButtonNode: MessageBodyNode = this.ctx.parseButtonCreation();
                    body.push(ButtonNode);
                    break;
            }
        }
                
        this.ctx.consume('R_BRACE');
        
        return {
            type: 'CrearMensaje',
            body
        };
    }
}