import { DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, MessageNode } from "../../types";
import { ODBMode, TokenTypeUnion } from "../../../chord/types";
import { SubParser } from "../../../chord/Parser/subparser";
import { BDOParser } from "../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../chord/Parser/Parser";

/**
 * The Message Parser.
 * This class is responsible for parsing message creation blocks, which include the message content, channel, embeds and buttons.
 * It constructs a MessageNode in the AST that represents the entire message definition.
 */
export default class MessageParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined = DisChordTokenType.Mensaje;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [ DisChordTokenType.Mensaje ];

    /**
     * Initializes the MessageParser with the main DisChordParser context for token expression handling.
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Parses a message creation block.
     * @returns {MessageNode} The AST node representing the message definition.
     */
    parse (): MessageNode {
        this.consume(DisChordTokenType.Mensaje);

        const object = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<MessageNode>({
            type: DisChordTokenType.CREAR_MENSAJE,
            object
        });
    }
}