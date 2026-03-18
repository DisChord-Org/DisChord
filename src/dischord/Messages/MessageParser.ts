import { DisChordParser } from "../parser";
import { MessageBodyNode, MessageNode } from "../types";
import ButtonParser from "./MessageComponents/ButtonParser";
import EmbedParser from "./MessageComponents/EmbedParser";

export default class MessageParser {
    private EmbedParser = new EmbedParser(this);
    private ButtonParser = new ButtonParser(this);
    
    public MessageParserContext;

    constructor (private ctx: DisChordParser) {
        this.MessageParserContext = ctx;
    }

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
                    const embed = this.EmbedParser.parse();

                    const embedNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'embed',
                        embed
                    };

                    body.push(embedNode);
                    break;
                case 'boton':
                    this.ctx.consume('IDENTIFICADOR');
                    const ButtonNode: MessageBodyNode = this.ButtonParser.parse();
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