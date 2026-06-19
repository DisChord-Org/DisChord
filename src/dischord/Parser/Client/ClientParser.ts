import { DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, StartBotNode } from "../../types";
import { DisChordError, ErrorLevel } from "../../../ChordError";
import { ODBMode, TokenTypeUnion } from "../../../chord/types";
import { SubParser } from "../../../chord/Parser/SubParser";
import { BDOParser } from "../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../chord/Parser/Parser";

/**
 * Handles the initial bot declaration.
 * Processes the 'encender bot' (turn on bot) statement and captures its configuration.
 */
export default class ClientParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined = DisChordTokenType.Encender;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [ DisChordTokenType.Encender, DisChordTokenType.Bot ];

    /**
     * @param parent - The main Parser context used to access token 
     * consumption and expression parsing methods.
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Starts the client declaration analysis.
     * Expected structure: `encender bot { ... }` or `encender bot <expression>`
     * @returns {StartBotNode} An AST node containing the configuration required to initialize the bot.
     * @throws {Error} If the identifier 'bot' does not immediately follow the 'encender' keyword.
     */
    parse (): StartBotNode {
        this.consume(DisChordTokenType.Encender);

        const id = this.consume(DisChordTokenType.Bot);

        if (id.type !== DisChordTokenType.Bot) throw new DisChordError({
            phase: ErrorLevel.Parser,
            message: `Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`,
            location: this.peek().location
        }).format();
        
        const configBody = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;
    
        return this.createNode<StartBotNode>({
            type: DisChordTokenType.ENCENDER_BOT,
            object: configBody
        });
    }
}