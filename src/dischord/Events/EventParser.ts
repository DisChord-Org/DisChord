import { ASTNode } from "../../chord/types";
import { DisChordParser } from "../parser";
import { EventNode } from "../types";

export default class EventParser {
    constructor (private ctx: DisChordParser) {}

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