import { ASTNode } from "../../chord/types";
import { DisChordParser } from "../parser";
import { CollectorNode, CollectorPulseBody } from "../types";

export default class CollectorParser {
    constructor (private ctx: DisChordParser) {}

    parse (): CollectorNode {
        this.ctx.consume('IDENTIFICADOR');

        const variable = this.ctx.parsePrimary();
        const body: CollectorPulseBody[] = [];

        this.ctx.consume('L_BRACE');
        while (this.ctx.peek().type !== 'R_BRACE') {
            const token = this.ctx.peek();

            switch (token.value) {
                case 'alPulsarId':
                    body.push(this.parseCollectorPulseBody());
                    break;
                default:
                    throw new Error(`Dentro del recolector se esperaba 'alPulsarId', se encontró '${token.value}'`);
            }
        }
        this.ctx.consume('R_BRACE');

        return {
            type: 'CrearRecolector',
            variable,
            body
        };
    }

    private parseCollectorPulseBody(): CollectorPulseBody {
        this.ctx.consume('IDENTIFICADOR'); // alPulsarId
        const id = this.ctx.parsePrimary();
        const body: ASTNode[] = [];

        this.ctx.consume('L_BRACE');
        while (this.ctx.peek().type !== 'R_BRACE') {
            body.push(this.ctx.parseStatement());
        }
        this.ctx.consume('R_BRACE');

        return {
            method: 'run',
            id,
            body
        }
    }
}