import { ASTNode } from "../../../chord/types";
import { EmbedAuthor, EmbedBody, EmbedColor, EmbedDescription, EmbedField, EmbedFooter, EmbedImage, EmbedThumbnail, EmbedTimestamp, EmbedTitle } from "../../types";
import MessageParser from "../MessageParser";

/**
 * The Embed Parser.
 * This class is responsible for parsing embed definitions within message bodies, extracting their properties and values to construct an EmbedBody in the AST.
 */
export default class EmbedParser {
    /**
     * @param ctx - The main MessageParser context for token expression handling
     */
    constructor (private ctx: MessageParser) {}

    /**
     * Parses an embed definition.
     * Expected structure: `{...}`
     * @returns {EmbedBody} The AST node representing the embed definition.
     */
    parse (): EmbedBody {
        this.ctx.MessageParserContext.consume('L_BRACE');

        const body: EmbedBody = {
            campos: []
        };
            
        while (this.ctx.MessageParserContext.peek().type !== 'R_BRACE') {
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

        this.ctx.MessageParserContext.consume('R_BRACE');

        return body;
    }
    
    /**
     * Parses an individual embed component.
     * @returns {EmbedTitle | EmbedDescription | EmbedColor | EmbedTimestamp | EmbedImage | EmbedThumbnail | EmbedAuthor | EmbedFooter | EmbedField} The parsed embed component.
     */
    private parseEmbedComponent(): EmbedTitle | EmbedDescription | EmbedColor | EmbedTimestamp | EmbedImage | EmbedThumbnail | EmbedAuthor | EmbedFooter | EmbedField {
        const token = this.ctx.MessageParserContext.peek();
    
        switch (token.value) {
            case 'titulo':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                return {
                    type: 'titulo',
                    object: this.ctx.MessageParserContext.parsePrimary()
                }
            case 'descripcion':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                return {
                    type: 'descripcion',
                    object: this.ctx.MessageParserContext.parsePrimary()
                }
            case 'color':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                return {
                    type: 'color',
                    object: this.ctx.MessageParserContext.parsePrimary()
                }
            case 'hora':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                return {
                    type: 'hora'
                }
            case 'imagen':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                return {
                    type: 'imagen',
                    object: this.ctx.MessageParserContext.parsePrimary()
                }
            case 'cartel':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                return {
                    type: 'cartel',
                    object: this.ctx.MessageParserContext.parsePrimary()
                }
            case 'autor':
                // this needs to be refactor
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
    
                if (this.ctx.MessageParserContext.peek().type === 'L_BRACE') {
                    this.ctx.MessageParserContext.consume('L_BRACE');
                    
                    let name: ASTNode,
                        iconUrl: ASTNode;
                        
                    if (this.ctx.MessageParserContext.peek().value === 'nombre') {
                        name = this.ctx.MessageParserContext.parsePrimary();
                    } else {
                        name = {
                            type: 'Literal',
                            value: '$CLIENTNAME',
                            raw: 'nombre'
                        }
                    }
                        
                    if (this.ctx.MessageParserContext.peek().value === 'icono') {
                        iconUrl = this.ctx.MessageParserContext.parsePrimary();
                    } else {
                        iconUrl = {
                            type: 'Literal',
                            value: '$CLIENTURL',
                            raw: 'icono'
                        }
                    }
                        
                    this.ctx.MessageParserContext.consume('R_BRACE');
    
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
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');

                if (this.ctx.MessageParserContext.peek().type === 'L_BRACE') {
                    this.ctx.MessageParserContext.consume('L_BRACE');
                        
                    let text: ASTNode,
                        iconUrl: ASTNode | undefined = undefined;
                        
                    if (this.ctx.MessageParserContext.peek().value === 'texto') {
                        text = this.ctx.MessageParserContext.parsePrimary();
    
                        if (this.ctx.MessageParserContext.peek().value === 'icono') {
                            iconUrl = this.ctx.MessageParserContext.parsePrimary();
                        }
                    } else {
                        text = {
                            type: 'Literal',
                            value: '$CLIENTNAME',
                            raw: 'texto'
                        };
                    }
                        
                    this.ctx.MessageParserContext.consume('R_BRACE');
    
                    return {
                        type: 'pie',
                        text,
                        iconUrl
                    }
                }
                    
                throw new Error(`En 'pie' se esperaba 'L_BRACE', se encontró '${this.ctx.MessageParserContext.peek().type}'`);
            case 'agregarCampo':
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
                this.ctx.MessageParserContext.consume('L_BRACE');
                    
                let text: ASTNode = this.ctx.MessageParserContext.parsePrimary(),
                    value: ASTNode = this.ctx.MessageParserContext.parsePrimary(),
                    inline: ASTNode = this.ctx.MessageParserContext.parsePrimary();
                
                this.ctx.MessageParserContext.consume('R_BRACE');
    
                return {
                    type: 'campo',
                    text,
                    value,
                    inline
                }
        }
    
        throw new Error(`No se esperaba encontrar '${this.ctx.MessageParserContext.peek().type}' dentro de un embed`);
    }
}