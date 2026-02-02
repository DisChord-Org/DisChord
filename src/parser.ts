import { ASTNode, Token } from "./types";

export class Parser {
    public nodes: ASTNode[] = [];

    constructor(private tokens: Token[], private current: number = 0) {}

    public parse(): ASTNode[] {
        while (this.current < this.tokens.length) {
            this.nodes.push(this.parseExpression());
        }
        return this.nodes;
    }

    private peek(): Token {
        if (this.current >= this.tokens.length) throw new Error("Se acabaron los tokens");
        return this.tokens[this.current];
    }

    private consume(expectedTypes: any): Token {
        const token = this.tokens[this.current];
        const expected = Array.isArray(expectedTypes) ? expectedTypes : [ expectedTypes ];

        if (!expected.includes(token.type)) throw new Error(`Se esperaba uno de ${expected.join(', ')} pero se encontró ${token.type}`);

        return this.tokens[this.current++];
    }

    private parseExpression(): ASTNode {
        const token = this.peek();

        if (token.type === 'IDENTIFICADOR') {
            return this.parseIdentifierOrCall();
        }

        if (token.type === 'NUMERO' || token.type === 'TEXTO') {
            return this.parseLiteral();
        }

        if (token.type === 'L_SQUARE') {
            this.consume('L_SQUARE');

            const elements: ASTNode[] = [];

            while (this.peek().type !== 'R_SQUARE') {
                elements.push(this.parseExpression());
                if (this.peek().type === ',') this.consume(',');
            }

            this.consume('R_SQUARE');

            return { type: 'LISTA', children: elements };
        }

        throw new Error(`Token inesperado en expresión: ${token.type}`);
    }

    private parseIdentifierOrCall(): ASTNode {
        let node: ASTNode = { type: 'IDENTIFICADOR', value: this.consume('IDENTIFICADOR').value };

        while (this.current < this.tokens.length && this.peek().type === '.') {
            this.consume('.');
            const property = this.consume('IDENTIFICADOR');
            
            node = {
                type: 'ACCESO',
                object: node,
                property: property.value
            };
        }

        if (this.current < this.tokens.length && this.peek().type === 'L_EXPRESSION') {
            this.consume('L_EXPRESSION');
            
            const args: ASTNode[] = [];
            while (this.peek().type !== 'R_EXPRESSION') {
                args.push(this.parseExpression());
                if (this.current < this.tokens.length && this.peek().type === ',') {
                    this.consume(',');
                }
            }
            this.consume('R_EXPRESSION');

            return { 
                type: 'LLAMADA', 
                value: node as any,
                children: args 
            };
        }

        return node;
    }

    private parseLiteral(): ASTNode {
        const token = this.consume(['NUMERO', 'TEXTO', 'BOOL', 'NULO']);

        return {
            type: 'LITERAL',
            value: token.type === 'NUMERO' ? Number(token.value) : token.value,
            raw: token.value
        };
    }
}