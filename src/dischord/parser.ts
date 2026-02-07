import { Parser } from '../chord/parser';
import { ASTNode, Token } from '../chord/types';

export class DisChordParser extends Parser {

    constructor (tokens: Token[], current: number = 0) {
        super(tokens, current);
    }

    protected parseCustomStatement(): ASTNode | null {
        if (this.peek().type === 'ENCENDER') {
            return this.parseBotDeclaration();
        }

        if (this.peek().type === 'EVENTO') {
            return this.parseEventDeclaration();
        }

        return null;
    }

    private parseBotDeclaration(): ASTNode {
        this.consume('ENCENDER');
        
        const id = this.consume('IDENTIFICADOR');
        if (id.value !== 'bot') {
            throw new Error(`Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`);
        }

        this.consume('L_BRACE');

        const configBody: ASTNode[] = [];
        while (this.peek().type !== 'R_BRACE') {
            configBody.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        return {
            type: 'ENCENDER_BOT',
            children: configBody
        };
    }

    private parseEventDeclaration(): ASTNode {
        this.consume('EVENTO');
        
        const eventName = this.consume('IDENTIFICADOR').value;

        this.consume('L_BRACE');

        const body: ASTNode[] = [];
        
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        return {
            type: 'EVENTO_DISCORD',
            value: eventName,
            children: body
        };
    }
}