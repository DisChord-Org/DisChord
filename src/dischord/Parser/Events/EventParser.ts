import { ASTNode } from "../../../chord/types";
import { DisChordParser } from "../parser";
import { EventNode } from "../../types";
import { KeyWords } from "../../../chord/keywords";
import { SubParser } from "../subparser";

/**
 * The Event Parser.
 * This class is responsible for parsing event definitions, which include the event name and its body of statements to execute when the event is triggered.
 */
export default class EventParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "evento";

    /**
     * @param parent - The main DisChordParser context for token expression handling
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
        KeyWords.addStatements([ "evento" ]);
    }

    /**
     * Parses an event definition.
     * Expected structure: `evento <nombre> {...}`
     * @returns {EventNode} The AST node representing the event definition.
     */
    parse (): EventNode {
        this.consume('EVENTO');

        const eventName = this.consume('IDENTIFICADOR').value;

        this.consume('L_BRACE');

        const body: ASTNode[] = [];

        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }
    
        this.consume('R_BRACE');
    
        return {
            type: 'Evento',
            name: eventName,
            body
        };
    }
}