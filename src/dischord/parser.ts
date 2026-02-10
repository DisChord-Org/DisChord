import { KeyWords } from '../chord/keywords';
import { Parser } from '../chord/parser';
import { ASTNode, Token } from '../chord/types';

export class DisChordParser extends Parser {

    constructor (tokens: Token[], current: number = 0) {
        super(tokens, current);
    }
    
    public static injectStatements() {
        KeyWords.addStatements([ "encender", "evento", "crear" ]);
    }

    protected parseCustomStatement(): ASTNode | null {
        switch (this.peek().type) {
            case 'ENCENDER':
                return this.parseBotDeclaration();
            case 'EVENTO':
                return this.parseEventDeclaration();
            case 'CREAR':
                return this.parseMessageCreation();
            default:
                return null;
        }
    }

    private parseBotDeclaration(): ASTNode {
        this.consume('ENCENDER');
        
        const id = this.consume('IDENTIFICADOR');
        if (id.value !== 'bot') {
            throw new Error(`Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`);
        }

        const configBody = this.parsePrimary();

        return {
            type: 'ENCENDER_BOT',
            object: configBody
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

    private parseMessageCreation(): ASTNode {
        this.consume('CREAR');

        const id = this.consume('IDENTIFICADOR');
        if (id.value != 'mensaje') {
            throw new Error(`Se esperaba 'mensaje' después de 'crear', se encontró '${id.value}'`);
        }

        const configBody = this.parsePrimary();

        return {
            type: 'CREAR_MENSAJE',
            object: configBody
        };

    }
}