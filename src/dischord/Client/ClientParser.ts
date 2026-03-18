import { DisChordParser } from "../parser";
import { StartBotNode } from "../types";

export default class ClientParser {
    constructor (private ctx: DisChordParser) {}

    parse (): StartBotNode {
        this.ctx.consume('ENCENDER');

        const id = this.ctx.consume('IDENTIFICADOR');
        if (id.value !== 'bot') {
            throw new Error(`Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`);
        }
    
        const configBody = this.ctx.parsePrimary();
    
        return {
            type: 'EncenderBot',
            object: configBody
        };
    }
}