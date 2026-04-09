import { DisChordParser } from "../parser";
import { StartBotNode } from "../../types";
import { KeyWords } from '../../../chord/keywords';
import { SubParser } from "../subparser";
import { ChordError, ErrorLevel } from "../../../ChordError";

/**
 * Handles the initial bot declaration.
 * Processes the 'encender bot' (turn on bot) statement and captures its configuration.
 */
export default class ClientParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "encender";

    /**
     * @param parent - The main DisChordParser context used to access token 
     * consumption and expression parsing methods.
     */
    constructor (protected parent: DisChordParser) {
        super(parent);
    }

    /**
     * Injects DisChord-specific keywords into the global system 
     * so the Lexer can correctly identify them as tokens.
     * This method is called by DisChordParser.
     */
    public static injectStatements () {
        KeyWords.addStatements([ "encender", "bot" ]);
    }

    /**
     * Starts the client declaration analysis.
     * Expected structure: `encender bot { ... }` or `encender bot <expression>`
     * @returns {StartBotNode} An AST node containing the configuration required to initialize the bot.
     * @throws {Error} If the identifier 'bot' does not immediately follow the 'encender' keyword.
     */
    parse (): StartBotNode {
        this.consume('ENCENDER');

        const id = this.consume('BOT');

        if (id.value !== 'bot') throw new ChordError(
            ErrorLevel.Parser,
            `Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`,
            this.peek().location,
            this.parent.input.split('\n')[this.peek().location.line - 1] || ''
        ).format();
        
        const configBody = this.parseODB('definition-only');
    
        return this.createNode<StartBotNode>({
            type: 'EncenderBot',
            object: configBody
        });
    }
}