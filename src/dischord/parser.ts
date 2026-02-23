import { KeyWords } from '../chord/keywords';
import { Parser } from '../chord/parser';
import { ASTNode, Token } from '../chord/types';
import { ButtonKeys, ButtonPropMap, CollectorNode, CollectorPulseBody, CommandNode, CommandOptionNode, CommandParam, EmbedAuthor, EmbedBody, EmbedColor, EmbedDescription, EmbedField, EmbedFooter, EmbedImage, EmbedThumbnail, EmbedTimestamp, EmbedTitle, EventNode, MessageBodyNode, MessageButtonNode, MessageNode, StartBotNode } from './types';

export class DisChordParser extends Parser {

    constructor (tokens: Token[], current: number = 0) {
        super(tokens, current);
    }
    
    public static injectStatements() {
        KeyWords.addStatements([ "encender", "evento", "crear" ]);
    }

    override parseCustomStatement(): ASTNode | null {
        const token = this.peek();
        
        let node: any = null; // this will save me work, sorry

        switch (token.type) {
            case 'ENCENDER':
                node = this.parseBotDeclaration();
                break;
            case 'EVENTO':
                node = this.parseEventDeclaration();
                break;
            case 'CREAR':
                node = this.parseCreation();
                break;
        }

        return node as unknown as ASTNode;
    }

    override parsePrimary(): ASTNode {
        const token = this.peek();

        switch (token.type) {
            case 'CREAR':
                return this.parseCreation() as unknown as ASTNode;
            default:
                return super.parsePrimary();
        }
    }

    private parseBotDeclaration(): StartBotNode {
        this.consume('ENCENDER');
        
        const id = this.consume('IDENTIFICADOR');
        if (id.value !== 'bot') {
            throw new Error(`Se esperaba 'bot' después de 'encender', se encontró '${id.value}'`);
        }

        const configBody = this.parsePrimary();

        return {
            type: 'EncenderBot',
            object: configBody
        };
    }

    private parseEventDeclaration(): EventNode {
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

    private parseCreation(): MessageNode | CommandNode | CollectorNode {
        this.consume('CREAR');

        switch(this.peek().value) {
            case 'mensaje':
                return this.parseMessageCreation();
            case 'comando':
                return this.parseCommandCreation();
            case 'recolector':
                return this.parseCollectorCreation();
        }

        throw new Error(`Se esperaba la creación de un comando o mensaje, se encontró '${this.peek().value}'`);
    }

    private parseMessageCreation(): MessageNode {
        this.consume('IDENTIFICADOR');
        this.consume('L_BRACE');
        
        const body: MessageBodyNode[] = [];
        
        while (this.peek().type !== 'R_BRACE') {
            const token = this.peek();

            switch (token.value) {
                case 'contenido':
                    this.consume('IDENTIFICADOR');
                    const content = this.parsePrimary();

                    const contentNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'contenido',
                        content
                    };

                    body.push(contentNode);
                    break;
                case 'canal':
                    this.consume('IDENTIFICADOR');
                    const channel = this.parsePrimary();

                    const channelNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'canal',
                        channel
                    };

                    body.push(channelNode);
                    break;
                case 'embed':
                    this.consume('IDENTIFICADOR');
                    const embed = this.parseEmbedCreation();

                    const embedNode: MessageBodyNode = {
                        type: 'CuerpoDelMensaje',
                        property: 'embed',
                        embed
                    };

                    body.push(embedNode);
                    break;
                case 'boton':
                    this.consume('IDENTIFICADOR');
                    const ButtonNode: MessageBodyNode = this.parseButtonCreation();
                    body.push(ButtonNode);
                    break;
            }
        }
        
        this.consume('R_BRACE');

        return {
            type: 'CrearMensaje',
            body
        };

    }
    
    private parseEmbedCreation(): EmbedBody {
        this.consume('L_BRACE');

        const body: EmbedBody = {
            campos: []
        };
        
        while (this.peek().type !== 'R_BRACE') {
            const embedComponent = this.parseEmbedComponent();

            switch (embedComponent.type) {
                case 'titulo':
                    body.titulo = embedComponent;
                    break;
                case 'descripcion':
                    body.descripcion = embedComponent;
                    break;
                case 'color':
                    body.color = embedComponent;
                    break
                case 'hora':
                    body.hora = embedComponent;
                    break;
                case 'imagen':
                    body.imagen = embedComponent;
                    break;
                case 'cartel':
                    body.cartel = embedComponent;
                    break;
                case 'autor':
                    body.autor = embedComponent;
                    break;
                case 'pie':
                    body.pie = embedComponent;
                    break;
                case 'campo':
                    body.campos.push(embedComponent);
                    break;
            }
        }
        
        this.consume('R_BRACE');

        return body;
    }

    private parseEmbedComponent(): EmbedTitle | EmbedDescription | EmbedColor | EmbedTimestamp | EmbedImage | EmbedThumbnail | EmbedAuthor | EmbedFooter | EmbedField {
        const token = this.peek();

        switch (token.value) {
            case 'titulo':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'titulo',
                    object: this.parsePrimary()
                }
            case 'descripcion':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'descripcion',
                    object: this.parsePrimary()
                }
            case 'color':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'color',
                    object: this.parsePrimary()
                }
            case 'hora':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'hora'
                }
            case 'imagen':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'imagen',
                    object: this.parsePrimary()
                }
            case 'cartel':
                this.consume('IDENTIFICADOR');

                return {
                    type: 'cartel',
                    object: this.parsePrimary()
                }
            case 'autor':
                // this needs to be refactor
                this.consume('IDENTIFICADOR');

                if (this.peek().type === 'L_BRACE') {
                    this.consume('L_BRACE');
                    
                    let name: ASTNode,
                        iconUrl: ASTNode;
                    
                    if (this.peek().value === 'nombre') {
                        name = this.parsePrimary();
                    } else {
                        name = {
                            type: 'Literal',
                            value: '$CLIENTNAME',
                            raw: 'nombre'
                        }
                    }
                    
                    if (this.peek().value === 'icono') {
                        iconUrl = this.parsePrimary();
                    } else {
                        iconUrl = {
                            type: 'Literal',
                            value: '$CLIENTURL',
                            raw: 'icono'
                        }
                    }
                    
                    this.consume('R_BRACE');

                    return {
                        type: 'autor',
                        name,
                        iconUrl
                    }
                }
                
                return {
                    type: 'autor',
                    name: {
                        type: 'Literal',
                        value: '$CLIENTNAME',
                        raw: 'nombre'
                    },
                    iconUrl: {
                        type: 'Literal',
                        value: '$CLIENTURL',
                        raw: 'icono'
                    }
                }
            case 'pie':
                // needs to be refactor
                this.consume('IDENTIFICADOR');

                if (this.peek().type === 'L_BRACE') {
                    this.consume('L_BRACE');
                    
                    let text: ASTNode,
                        iconUrl: ASTNode | undefined = undefined;
                    
                    if (this.peek().value === 'texto') {
                        text = this.parsePrimary();

                        if (this.peek().value === 'icono') {
                            iconUrl = this.parsePrimary();
                        }
                    } else {
                        text = {
                            type: 'Literal',
                            value: '$CLIENTNAME',
                            raw: 'texto'
                        };
                    }
                    
                    this.consume('R_BRACE');

                    return {
                        type: 'pie',
                        text,
                        iconUrl
                    }
                }
                
                throw new Error(`En 'pie' se esperaba 'L_BRACE', se encontró '${this.peek().type}'`);
            case 'agregarCampo':
                this.consume('IDENTIFICADOR');

                this.consume('L_BRACE');
                
                let text: ASTNode = this.parsePrimary(),
                    value: ASTNode = this.parsePrimary(),
                    inline: ASTNode = this.parsePrimary();
                
                this.consume('R_BRACE');

                return {
                    type: 'campo',
                    text,
                    value,
                    inline
                }
        }

        throw new Error(`No se esperaba encontrar '${this.peek().type}' dentro de un embed`);
    }

    private parseCommandCreation(): CommandNode {
        this.consume('IDENTIFICADOR');
        const commandName = this.consume('IDENTIFICADOR').value;

        this.consume('L_BRACE');

        const body: ASTNode[] = [];
        const params: CommandParam[] = [];
        
        while (this.peek().type !== 'R_BRACE') {
            switch (this.peek().value) {
                case 'descripcion':
                    this.consume('IDENTIFICADOR');
                    const value: ASTNode = this.parsePrimary();

                    const param: CommandParam = {
                        type: 'ParametroDeComando',
                        property: 'Descripcion',
                        value
                    };

                    params.push(param);
                    break;
                case 'opciones':
                    this.consume('IDENTIFICADOR');
                    const options: CommandOptionNode[] = [];

                    this.consume('L_BRACE');
                    while (this.peek().type !== 'R_BRACE') {
                        options.push(this.parseCommandOption());
                    }
                    this.consume('R_BRACE');

                    const optionsParam: CommandParam = {
                        type: 'ParametroDeComando',
                        property: 'Opciones',
                        options
                    }

                    params.push(optionsParam);
                    break;
                default:
                    body.push(this.parseStatement());
            }
        }

        this.consume('R_BRACE');
        return {
            type: 'CrearComando',
            value: commandName,
            body,
            params
        }
    }

    private parseCommandOption(): CommandOptionNode {
        const name = this.consume('IDENTIFICADOR').value;
        const option: Partial<CommandOptionNode> = {
            type: 'ParametroDeComando',
            name
        };

        // this part needs to be refactor.
        // actually, you just can set one type of option and the rest of properties in any order.
        this.consume('L_BRACE');
        while (this.peek().type !== 'R_BRACE') {
            const token = this.peek();

            switch (token.value) {
                case 'tipo':
                    this.consume('TIPO');
                    const type = this.parsePrimary();
                    if (type.type != 'Literal') throw new Error(`El tipo de opción de comando debe ser un literal, se encontró '${type.type}'`);
                    if (type.value != 'Texto') throw new Error(`Actualmente solo se soporta el tipo 'Texto' para opciones de comando, se encontró '${type.value}'`);
                    option.property = type.value;
                    break;
                case 'descripcion':
                    this.consume('IDENTIFICADOR');
                    option.description = this.parsePrimary();
                    break;
                case 'requerido':
                    this.consume('IDENTIFICADOR');
                    option.required = this.parsePrimary();
                    break;
                default:
                    throw new Error(`Dentro de las opciones de comando solo se permiten 'tipo', 'descripcion' y 'requerido', se encontró '${token.value}'`);
            }
        }
        this.consume('R_BRACE');

        if (!option.property || !option.description || option.required === undefined) throw new Error(`Faltan propiedades para la opción de comando '${name}'`);

        return option as CommandOptionNode;
    }

    private parseButtonCreation(): MessageButtonNode {
        this.consume('L_BRACE');

        const button = {
            type: 'CuerpoDelMensaje',
            property: 'boton',
        } as MessageButtonNode;

        while (this.peek().type !== 'R_BRACE') {
            const token = this.peek();
            const ButtonKey = token.value as ButtonKeys;

            if (ButtonPropMap[ButtonKey]) {
                this.consume('IDENTIFICADOR');

                const propName = ButtonPropMap[ButtonKey];
                const value = this.parsePrimary();

                button[propName] = value;
            } else throw new Error(`Propiedad de botón desconocida: '${token.value}'`);
        }

        this.consume('R_BRACE');
        return button;
    }

    private parseCollectorCreation(): CollectorNode {
        this.consume('IDENTIFICADOR');

        const variable = this.parsePrimary();
        const body: CollectorPulseBody[] = [];

        this.consume('L_BRACE');
        while (this.peek().type !== 'R_BRACE') {
            const token = this.peek();

            switch (token.value) {
                case 'alPulsarId':
                    body.push(this.parseCollectorPulseBody());
                    break;
                default:
                    throw new Error(`Dentro del recolector se esperaba 'alPulsarId', se encontró '${token.value}'`);
            }
        }
        this.consume('R_BRACE');

        return {
            type: 'CrearRecolector',
            variable,
            body
        };
    }

    private parseCollectorPulseBody(): CollectorPulseBody {
        this.consume('IDENTIFICADOR'); // alPulsarId
        const id = this.parsePrimary();
        const body: ASTNode[] = [];

        this.consume('L_BRACE');
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }
        this.consume('R_BRACE');

        return {
            method: 'run',
            id,
            body
        }
    }
}