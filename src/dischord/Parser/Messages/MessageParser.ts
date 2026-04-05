import { DisChordParser } from "../parser";
import { MessageBodyNode, MessageNode } from "../../types";
import ButtonParser from "./MessageComponents/ButtonParser";
import EmbedParser from "./MessageComponents/EmbedParser";
import { KeyWords } from "../../../chord/keywords";
import { SubParser } from "../subparser";

/**
 * The Message Parser.
 * This class is responsible for parsing message creation blocks, which include the message content, channel, embeds and buttons.
 * It constructs a MessageNode in the AST that represents the entire message definition.
 */
export default class MessageParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "mensaje";

    // Parsers for message components
    private EmbedParser = new EmbedParser(this);
    // The ButtonParser is initialized after the EmbedParser to ensure it has access to the MessageParser context if needed
    private ButtonParser = new ButtonParser(this);

    // Expose the MessageParser context to component parsers
    public MessageParserContext;

    /**
     * Initializes the MessageParser with the main DisChordParser context for token expression handling.
     * @param parent - The main DisChordParser context for token expression handling
     */
    constructor (protected parent: DisChordParser) {
        super(parent);
        this.MessageParserContext = parent;
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
        this.consume('MENSAJE');

        const configBody = this.parseODB('definition-only');

        return {
            type: 'CrearMensaje',
            object: configBody
        };
    }
}