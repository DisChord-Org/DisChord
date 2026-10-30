import { DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, MessageNode } from "../../../types";
import { ODBMode, TokenType, TokenTypeUnion } from "../../../../chord/model/types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { BDOParser } from "../../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../../chord/Parser/Parser";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";

/**
 * The Message Parser.
 * This class is responsible for parsing message creation blocks, which include the message content, channel, embeds and buttons.
 * It constructs a MessageNode in the AST that represents the entire message definition.
 *
 * Triggers on `enviar mensaje { ... }`, not `nuevo mensaje { ... }` — sending a message is an
 * action with a side effect (it dispatches the message right there), not the construction of an
 * instance, so `nuevo` (reserved for actual instantiation, e.g. `nuevo Embed()`-style values) was
 * the wrong verb for it. Same two-token trigger shape as `encender bot` (`ClientParser`).
 */
export default class MessageParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined = DisChordTokenType.Enviar;

    /**
     * Collection of reserved keywords this specific sub-parser registers. Only `enviar`: `mensaje` is
     * an ordinary word, since it is also the name of the parameter of the message events.
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [ DisChordTokenType.Enviar ];

    /**
     * Initializes the MessageParser with the main DisChordParser context for token expression handling.
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Parses a message creation block.
     * Expected structure: `enviar mensaje {...}`
     * @returns {MessageNode} The AST node representing the message definition.
     */
    parse (): MessageNode {
        this.consume(DisChordTokenType.Enviar);

        const word = this.peek();

        if (word.type !== TokenType.IDENTIFICADOR || word.value.toLowerCase() !== 'mensaje') throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `Después de 'enviar' se esperaba 'mensaje'. (En su lugar se encontró '${word.value}')`,
            location: word.location
        });

        this.consume(TokenType.IDENTIFICADOR);

        const object = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<MessageNode>({
            type: DisChordTokenType.CREAR_MENSAJE,
            object
        });
    }
}