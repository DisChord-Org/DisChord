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
                return this.parseCreation();
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

    private parseCreation(): ASTNode {
        this.consume('CREAR');

        switch(this.peek().value) {
            case 'mensaje':
                return this.parseMessageCreation();
            case 'embed':
                return this.parseEmbedCreation();
        }

        throw new Error(`Se esperaba la creación de un comando o mensaje, se encontró '${this.peek().value}'`);
    }

    private parseMessageCreation(): ASTNode {
        this.consume('IDENTIFICADOR');

        const configBody = this.parsePrimary();

        return {
            type: 'CREAR_MENSAJE',
            object: configBody
        };

    }
    
    private parseEmbedCreation(): ASTNode {
        this.consume('IDENTIFICADOR');
        this.consume('L_BRACE');

        const body: ASTNode[] = [];
        
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseEmbedComponent());
        }
        
        this.consume('R_BRACE');

        return {
            type: "CREAR_EMBED",
            children: body
        }
    }

    private parseEmbedComponent(): ASTNode {
        const token = this.peek();

        switch (token.value) {
            case 'canal':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'CANAL',
                    object: this.parsePrimary()
                }
            case 'titulo':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'TITULO',
                    object: this.parsePrimary()
                }
            case 'descripcion':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'DESCRIPCION',
                    object: this.parsePrimary()
                }
            case 'color':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'COLOR',
                    object: this.parsePrimary()
                }
            case 'hora':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'HORA'
                }
            case 'imagen':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'IMAGEN',
                    object: this.parsePrimary()
                }
            case 'cartel':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'CARTEL',
                    object: this.parsePrimary()
                }
            case 'autor':
                this.consume('IDENTIFICADOR');

                if (this.peek().type === 'L_BRACE') {
                    this.consume('L_BRACE');
                    
                    let name: ASTNode,
                    iconUrl: ASTNode;
                    
                    if (this.peek().value === 'nombre') {
                        this.consume('IDENTIFICADOR');
                        name = this.consume('TEXTO');
                        name.raw = 'nombre';
                    } else name = { type: 'TEXTO', value: '$CLIENTNAME', raw: 'nombre' };
                    
                    if (this.peek().value === 'icono') {
                        this.consume('IDENTIFICADOR');
                        iconUrl = this.consume('TEXTO');
                        iconUrl.raw = 'icono';
                    } else iconUrl = { type: 'TEXTO', value: '$CLIENTURL', raw: 'icono' };
                    
                    this.consume('R_BRACE');

                    return {
                        type: 'AUTOR',
                        children: [ name, iconUrl ]
                    }
                }
                
                return {
                    type: 'AUTOR',
                    children: [
                        { type: 'TEXTO', value: '$CLIENTNAME', raw: 'nombre' },
                        { type: 'TEXTO', value: '$CLIENTURL', raw: 'icono' }
                    ]
                }
            case 'pie':
                this.consume('IDENTIFICADOR');

                if (this.peek().type === 'L_BRACE') {
                    this.consume('L_BRACE');
                    
                    let text: ASTNode,
                        iconUrl: ASTNode | undefined = undefined;
                    
                    if (this.peek().value === 'texto') {
                        this.consume('IDENTIFICADOR');
                        text = this.consume('TEXTO');
                        text.raw = 'texto';

                        if (this.peek().value === 'icono') {
                            this.consume('IDENTIFICADOR');
                            iconUrl = this.consume('TEXTO');
                            iconUrl.raw = 'icono';
                        }
                    } else text = { type: 'TEXTO', value: '$CLIENTNAME', raw: 'texto' };
                    
                    this.consume('R_BRACE');

                    return {
                        type: 'PIE',
                        children: iconUrl? [ text, iconUrl ] : [ text ]
                    }
                }
                
                throw new Error(`En 'pie' se esperaba 'L_BRACE', se encontró '${this.peek().type}'`);
            case 'agregarCampo':
                this.consume('IDENTIFICADOR');

                this.consume('L_BRACE');
                
                let text: ASTNode,
                    value: ASTNode,
                    inline: ASTNode;

                this.consume('IDENTIFICADOR');
                text = this.consume('TEXTO');
                this.consume('IDENTIFICADOR');
                value = this.consume('TEXTO');
                this.consume('IDENTIFICADOR');
                inline = this.consume('BOOL');
                
                this.consume('R_BRACE');

                return {
                    type: 'CAMPO',
                    children: [ text, value, inline ]
                }
        }

        throw new Error(`No se esperaba encontrar '${this.peek().type}' dentro de un embed`);
    }
}