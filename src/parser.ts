import { ASTNode, ClassNode, FunctionNode, PropertyNode, Token, VarNode } from "./types";

export class Parser {
    public nodes: ASTNode[] = [];

    constructor(private tokens: Token[], private current: number = 0) {}

    public parse(): ASTNode[] {
        while (this.current < this.tokens.length) {
            this.nodes.push(this.parseStatement());
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

    private parseStatement(classContext?: string): ASTNode {
        const token = this.peek();

        if (token.type === 'CLASE') {
            return this.parseClassDeclaration();
        }

        if (token.type === 'FIJAR') {
            this.consume('FIJAR');
            const nextToken = this.peek();
            
            if (nextToken.type === 'PROP') {
                const prop = this.parseProperty();
                prop.isStatic = true;
                return prop;
            }
            
            if (nextToken.type === 'FUNCION') {
                const func = this.parseFunctionDeclaration(false);
                func.isStatic = true;
                return func;
            }
        }

        if (token.type === 'FUNCION') {
            return this.parseFunctionDeclaration(false);
        }

        if (token.type === 'PROP') {
            return this.parseProperty();
        }

        if (token.type === 'VAR') {
            return this.parseVariableDeclaration();
        }

        if (classContext && token.type === 'IDENTIFICADOR' && token.value === classContext) {
            if (this.current + 1 < this.tokens.length && this.tokens[this.current + 1].type === 'L_EXPRESSION') {
                return this.parseFunctionDeclaration(true);
            }
        }

        return this.parseExpression();
    }

    private parseClassDeclaration(): ClassNode {
        this.consume('CLASE');
        
        const id = this.consume('IDENTIFICADOR').value;
        
        let superClass = undefined;
        if (this.current < this.tokens.length && this.peek().type === 'EXTIENDE') {
            this.consume('EXTIENDE');
            superClass = this.consume('IDENTIFICADOR').value;
        }

        this.consume('L_BRACE');

        const body: ASTNode[] = [];
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement(id));
        }

        this.consume('R_BRACE');

        return {
            type: 'CLASE',
            id,
            superClass,
            body
        };
    }

    private parseFunctionDeclaration(isConstructor: boolean): FunctionNode {
        let id: string;
        
        if (isConstructor) {
            id = this.consume('IDENTIFICADOR').value;
        } else {
            this.consume('FUNCION');
            id = this.consume('IDENTIFICADOR').value;
        }

        this.consume('L_EXPRESSION');

        const params: string[] = [];
        while (this.peek().type !== 'R_EXPRESSION') {
            params.push(this.consume('IDENTIFICADOR').value);
            if (this.peek().type === ',') this.consume(',');
        }

        this.consume('R_EXPRESSION');
        this.consume('L_BRACE');

        const body: ASTNode[] = [];
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        return {
            type: 'FUNCION',
            id,
            isConstructor,
            params,
            body
        };
    }

    private parseProperty(): PropertyNode {
        this.consume('PROP');
        const id = this.consume('IDENTIFICADOR').value;
        
        let value: ASTNode = { type: 'IDENTIFICADOR', value: 'INDEFINIDO' };

        if (this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression();
        }

        return {
            type: 'PROPIEDAD',
            id,
            prop_value: value
        };
    }

    private parseExpression(): ASTNode {
        let left = this.parsePrimary();

        const binaryExpressions = ['MAS', 'MENOS', 'POR', 'ENTRE', 'RESTO', 'EXP', 'INTRO', 'ESPACIO'];

        while (this.current < this.tokens.length && binaryExpressions.includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            const right = this.parsePrimary();
            
            left = {
                type: 'OPERACION_BINARIA',
                left,
                operator: operator.type,
                right
            };
        }

        if (this.current < this.tokens.length && this.peek().type === 'ES') {
            this.consume('ES');
            const value = this.parseExpression();
            
            return {
                type: 'ASIGNACION',
                object: left,
                value: value as any
            };
        }

        return left;
    }

    private parsePrimary(): ASTNode {
        const token = this.peek();

        if (token.type === 'ESPACIO') {
            this.consume('ESPACIO');
            return {
                type: 'LITERAL',
                value: ' ',
                raw: ' '
            }
        }

        if (token.type === 'INTRO') {
            this.consume('INTRO');
            return {
                type: 'LITERAL',
                value: '\\n',
                raw: '\\n'
            }
        }

        if (token.type === 'SUPER') {
            this.current++;
            return this.parseIdentifierOrCall({ type: 'SUPER', value: 'super' });
        }

        if (token.type === 'ESTA') {
            const estaNode: ASTNode = { type: 'ESTA', value: 'this' };
            this.current++;
            return this.parseIdentifierOrCall(estaNode);
        }

        if (token.type === 'IDENTIFICADOR') {
            return this.parseIdentifierOrCall();
        }

        if (token.type === 'NUMERO' || token.type === 'TEXTO' || token.type === 'BOOL' || token.type === 'INDEFINIDO') {
            return this.parseLiteral();
        }

        if (token.type === 'NUEVO') {
            this.consume('NUEVO');
            const call = this.parseIdentifierOrCall(); 
            return {
                type: 'NUEVO',
                object: call
            };
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
        
        throw new Error(`Token inesperado en expresión: ${token.type} en la posición ${this.current}`);
    }

    private parseIdentifierOrCall(startNode?: ASTNode): ASTNode {
        let node: ASTNode = startNode || { type: 'IDENTIFICADOR', value: this.consume('IDENTIFICADOR').value };

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
        const token = this.consume(['NUMERO', 'TEXTO', 'BOOL', 'INDEFINIDO']);

        let value: boolean | number | string | undefined = token.value;

        switch (token.type) {
            case 'BOOL':
                value = token.value === 'verdadero';
                break;
            case 'NUMERO':
                value = Number(token.value);
                break;
            case 'INDEFINIDO':
                value = undefined;
                break;
        }

        return {
            type: 'LITERAL',
            value,
            raw: token.value
        };
    }

    private parseVariableDeclaration(): VarNode {
        this.consume('VAR');
        const id = this.consume('IDENTIFICADOR').value;
        
        let value: ASTNode = { type: 'LITERAL', value: "indefinido", raw: 'indefinido' };

        if (this.current < this.tokens.length && this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression();
        }

        return {
            type: 'VAR',
            id,
            prop_value: value
        };
    }
}