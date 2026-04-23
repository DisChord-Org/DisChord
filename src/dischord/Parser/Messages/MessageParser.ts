import { DisChordParser } from "../parser";
import { MessageNode } from "../../types";
import { KeyWords } from "../../../chord/keywords";
import { SubParser } from "../subparser";
import { ODBMode } from "../../../chord/types";

/**
 * The Message Parser.
 * This class is responsible for parsing message creation blocks, which include the message content, channel, embeds and buttons.
 * It constructs a MessageNode in the AST that represents the entire message definition.
 */
export default class MessageParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "mensaje";

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

        const configBody = this.parseODB(ODBMode.Simple);

        return this.createNode<MessageNode>({
            type: 'CrearMensaje',
            object: configBody
        });
    }
}