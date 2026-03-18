import { ButtonKeys, ButtonPropMap, MessageButtonNode } from "../../types";
import MessageParser from "../MessageParser";

/**
 * The Button Parser.
 * This class is responsible for parsing button definitions within message bodies, extracting their properties and values to construct a MessageButtonNode in the AST.
 */
export default class ButtonParser {
    /**
     * @param ctx - The main MessageParser context for token expression handling
     */
    constructor (private ctx: MessageParser) {}

    /**
     * Parses a button definition.
     * Expected structure: `{...}`
     * @returns {MessageButtonNode} The AST node representing the button definition.
     */
    parse (): MessageButtonNode {
        this.ctx.MessageParserContext.consume('L_BRACE');
        const button = {
            type: 'CuerpoDelMensaje',
            property: 'boton',
        } as MessageButtonNode;

        while (this.ctx.MessageParserContext.peek().type !== 'R_BRACE') {
            const token = this.ctx.MessageParserContext.peek();
            const ButtonKey = token.value as ButtonKeys;

            if (ButtonPropMap[ButtonKey]) {
                this.ctx.MessageParserContext.consume('IDENTIFICADOR');
        
                const propName = ButtonPropMap[ButtonKey];
                const value = this.ctx.MessageParserContext.parsePrimary();
        
                button[propName] = value;
            } else throw new Error(`Propiedad de botón desconocida: '${token.value}'`);
        }
        
        this.ctx.MessageParserContext.consume('R_BRACE');
        return button;
    }
}