import { DisChordParser } from "../parser";
import { MessageBodyNode, MessageNode } from "../../types";
import ButtonParser from "./MessageComponents/ButtonParser";
import EmbedParser from "./MessageComponents/EmbedParser";
import { KeyWords } from "../../../chord/keywords";

/**
 * The Message Parser.
 * This class is responsible for parsing message creation blocks, which include the message content, channel, embeds and buttons.
 * It constructs a MessageNode in the AST that represents the entire message definition.
 */
export default class MessageParser {
    // Parsers for message components
    private EmbedParser = new EmbedParser(this);
    // The ButtonParser is initialized after the EmbedParser to ensure it has access to the MessageParser context if needed
    private ButtonParser = new ButtonParser(this);

    // Expose the MessageParser context to component parsers
    public MessageParserContext;

    /**
     * Initializes the MessageParser with the main DisChordParser context for token expression handling.
     * @param ctx - The main DisChordParser context for token expression handling
     */
    constructor (private ctx: DisChordParser) {
        this.MessageParserContext = ctx;
    }

    /**
     * Injects DisChord-specific keywords into the global system 
     * so the Lexer can correctly identify them as tokens.
     * This method is called by DisChordParser.
     */
    public static injectStatements () {
        KeyWords.addStatements([ "mensaje" ]);
    }

    /**
     * Parses a message creation block.
     * @returns {MessageNode} The AST node representing the message definition.
     */
    parse (): MessageNode {
        this.ctx.consume('MENSAJE');
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