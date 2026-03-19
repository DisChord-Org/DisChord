import { DisChordParser } from "../parser";
import { StartBotNode } from "../../types";

/**
 * Handles the initial bot declaration.
 * Processes the 'encender bot' (turn on bot) statement and captures its configuration.
 */
export default class ClientParser {
    /**
     * @param ctx - The main DisChordParser context used to access token 
     * consumption and expression parsing methods.
     */
    constructor (private ctx: DisChordParser) {}

    /**
     * Starts the client declaration analysis.
     * Expected structure: `encender bot { ... }` or `encender bot <expression>`
     * @returns {StartBotNode} An AST node containing the configuration required to initialize the bot.
     * @throws {Error} If the identifier 'bot' does not immediately follow the 'encender' keyword.
     */
    parse (): StartBotNode {
        this.ctx.consume('ENCENDER');

        const id = this.ctx.consume('IDENTIFICADOR');
        if (id.value !== 'bot') {
            throw new Error(`Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`);
        }
    
        const configBody = this.ctx.parseODB([ 'token', 'prefijo', 'prefijos', 'intenciones' ]);
    
        return {
            type: 'EncenderBot',
            object: configBody
        };
    }
}