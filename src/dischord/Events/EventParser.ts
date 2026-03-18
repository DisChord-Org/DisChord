import { ASTNode } from "../../chord/types";
import { DisChordParser } from "../parser";
import { EventNode } from "../types";

/**
 * The Event Parser.
 * This class is responsible for parsing event definitions, which include the event name and its body of statements to execute when the event is triggered.
 */
export default class EventParser {
    /**
     * @param ctx - The main DisChordParser context for token expression handling
     */
    constructor (private ctx: DisChordParser) {}

    /**
     * Parses an event definition.
     * Expected structure: `evento <nombre> {...}`
     * @returns {EventNode} The AST node representing the event definition.
     */
    parse (): EventNode {
        this.ctx.consume('EVENTO');

        const eventName = this.ctx.consume('IDENTIFICADOR').value;

        this.ctx.consume('L_BRACE');

        const body: ASTNode[] = [];

        while (this.ctx.peek().type !== 'R_BRACE') {
            body.push(this.ctx.parseStatement());
        }
    
        this.ctx.consume('R_BRACE');
    
        return {
            type: 'Evento',
            name: eventName,
            body
        };
    }
}