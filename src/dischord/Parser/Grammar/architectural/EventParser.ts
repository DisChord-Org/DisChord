import { DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../../types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { TokenType, TokenTypeUnion } from "../../../../chord/types";
import { BlockParser } from "../../../../chord/Parser/Grammar/BlockParser";
import { Parser } from "../../../../chord/Parser/Parser";

/**
 * The Event Parser.
 * This class is responsible for parsing event definitions, which include the event name and its body of statements to execute when the event is triggered.
 */
export default class EventParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined = DisChordTokenType.Evento;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ DisChordTokenType.Evento ];

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Parses an event definition.
     * Expected structure: `evento <nombre> {...}`
     * @returns {EventNode} The AST node representing the event definition.
     */
    parse (): EventNode {
        this.consume(DisChordTokenType.Evento);

        const eventName = this.consume(TokenType.IDENTIFICADOR).value;
        const body = this.parent.get(BlockParser).parse().body;
    
        return this.createNode<EventNode>({
            type: DisChordTokenType.EVENTO,
            name: eventName,
            body
        });
    }
}