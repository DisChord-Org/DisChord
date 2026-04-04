import { ASTNode, ClassNode, ConditionNode, LoopNode, FunctionNode, PropertyNode, Token, VariableNode, Symbol, SymbolKind, IdentificatorNode, NewNode, ThisNode, SuperNode, ObjectProperty, ReturnNode, ExportNode, ObjectNode } from "./types";

export class Parser<T = never, N = never> {
    public symbols: Map<string, Symbol> = new Map();
    public nodes: ASTNode<T, N>[] = [];

    constructor(private tokens: Token[], private current: number = 0) {}

    private registerSymbol(name: string, info: Partial<Symbol>) {
        this.symbols.set(name, {
            name,
            kind: info.kind || SymbolKind.Variable,
            metadata: {
                isAsync: info.metadata?.isAsync || false,
                isExported: info.metadata?.isExported || false,
            }
        });
    }

    parse(): ASTNode<T, N>[] {
        while (this.current < this.tokens.length) {
            this.nodes.push(this.parseStatement());
        }
        return this.nodes;
    }

    peek(type: 'this' | 'next' = 'this'): Token {
        const targetIndex = type === 'this' ? this.current : this.current + 1;
        if (targetIndex >= this.tokens.length) throw new Error("Se acabaron los tokens");
        return this.tokens[targetIndex];
    }

    consume(expectedTypes: string | string[]): Token {
        const token = this.tokens[this.current];
        const expected = Array.isArray(expectedTypes) ? expectedTypes : [ expectedTypes ];

        if (!expected.includes(token.type)) throw new Error(`Se esperaba uno de ${expected.join(', ')} pero se encontró ${token.type}`);

        return this.tokens[this.current++];
    }

    protected parseCustomStatement(): ASTNode<T, N> | null {
        return null;
    }

    parseStatement(classContext?: string): ASTNode<T, N> {
        const token = this.peek();

        const custom = this.parseCustomStatement();
        if (custom) return custom;

        if (token.type === 'DECORADOR' && token.value === '@asincrono') {
            this.consume('DECORADOR');
            
            if (this.peek().type === 'FIJAR') {
                this.consume('FIJAR');
                const func = this.parseFunctionDeclaration(false, true, true);
                func.metadata.isStatic = true;
                return func;
            }

            const func = this.parseFunctionDeclaration(false, !!classContext, true);
            return func;
        }

        if (token.type === 'SI') {
            return this.parseIfStatement();
        }

        if (token.type === 'PARA') {
            return this.parseForStatement();
        }

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
                const func = this.parseFunctionDeclaration(false, true);
                func.metadata.isStatic = true;
                return func;
            }
        }

        if (token.type === 'FUNCION') {
            return this.parseFunctionDeclaration(false, !!classContext);
        }

        if (token.type === 'PROP') {
            return this.parseProperty();
        }

        if (token.type === 'VAR') {
            return this.parseVariableDeclaration();
        }

        if (token.type === 'SALIR') {
            this.consume('SALIR');
            return { type: 'Salir' };
        }

        if (token.type === 'PASAR') {
            this.consume('PASAR');
            return { type: 'Pasar' };
        }

        if (token.type === 'DEVOLVER') {
            this.consume('DEVOLVER');
            
            const next = this.peek();
            let value = undefined;
            
            if (next.type !== 'R_BRACE' && next.type !== 'SINO' && next.type !== 'ADEMAS') {
                value = this.parseExpression();
            }

            return {
                type: 'Devolver',
                object: value
            } as ReturnNode<T, N>;
        }

        if (token.type === 'EXPORTAR') {
            this.consume('EXPORTAR');
            const declaration = this.parseStatement();
            
            return {
                type: 'Exportar',
                object: declaration
            } as ExportNode<T, N>;
        }

        if (token.type === 'IMPORTAR') {
            this.consume('IMPORTAR');
            this.consume('L_BRACE');

            const identificators: string[] = [];
            while (this.peek().type !== 'R_BRACE') {
                identificators.push(this.consume('IDENTIFICADOR').value);
                if (this.peek().type === ',') this.consume(',');
            }

            this.consume('R_BRACE');
            this.consume('DESDE');
            
            const pathToken = this.consume('TEXTO'); 
            const modulePath = pathToken.value;

            return {
                type: 'Importar',
                identificators,
                path: modulePath
            };
        }

        if (classContext && token.type === 'IDENTIFICADOR' && token.value === classContext) {
            if (this.current + 1 < this.tokens.length && this.tokens[this.current + 1].type === 'L_EXPRESSION') {
                return this.parseFunctionDeclaration(true);
            }
        }

        return this.parseExpression();
    }

    private parseClassDeclaration(): ClassNode<T, N> {
        this.consume('CLASE');
        
        const id = this.consume('IDENTIFICADOR').value;
        
        let superClass = undefined;
        if (this.current < this.tokens.length && this.peek().type === 'EXTIENDE') {
            this.consume('EXTIENDE');
            superClass = this.consume('IDENTIFICADOR').value;
        }

        this.consume('L_BRACE');

        const body: ASTNode<T, N>[] = [];
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement(id));
        }

        this.consume('R_BRACE');

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Class
        });

        return {
            type: 'Clase',
            id,
            superClass,
            body
        };
    }

    private parseFunctionDeclaration(isConstructor: boolean, isMethod: boolean = true, isAsync: boolean = false): FunctionNode<T, N> {
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

        const body: ASTNode<T, N>[] = [];
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Function,
            metadata: {
                isAsync
            }
        });

        return {
            type: 'Funcion',
            id,
            metadata: {
                isConstructor,
                isMethod,
                isAsync
            },
            params,
            body
        };
    }

    private parseProperty(): PropertyNode<T, N> {
        this.consume('PROP');
        const id = this.consume('IDENTIFICADOR').value;
        
        let value: ASTNode<T, N> = {
            type: 'Literal',
            value: undefined,
            raw: 'indefinido'
        };

        if (this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression();
        }

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Property
        });

        return {
            type: 'Propiedad',
            id,
            value
        };
    }

    private parseExpression(): ASTNode<T, N> {
        let left = this.parsePrimary();

        const binaryExpressions = [
            'MAS', 'MENOS', 'POR', 'ENTRE', 'RESTO', 'EXP', 'INTRO', 'ESPACIO',
            'MAYOR', 'MENOR', 'MAYOR_IGUAL', 'MENOR_IGUAL', 'IGUAL', 'IGUAL_TIPADO', 'NO_IGUAL', 'NO_IGUAL_TIPADO', 'DIFERENTE', 'Y', 'O'
        ];

        while (this.current < this.tokens.length && binaryExpressions.includes(this.peek().type)) {
            const operator = this.consume(this.peek().type);
            const right = this.parsePrimary();
            
            left = {
                type: 'ExpresionBinaria',
                left,
                operator: operator.type,
                right
            };
        }

        if (this.current < this.tokens.length && this.peek().type === 'ES') {
            this.consume('ES');
            const value = this.parseExpression();
            
            return {
                type: 'Asignacion',
                left,
                assignment: value
            };
        }

        return left;
    }

    parsePrimary(): ASTNode<T, N> {
        const token = this.peek();

        if (token.value === 'js') {
            this.consume('JS');
            this.consume('L_EXPRESSION');
            
            const content = this.consume('TEXTO').value; 
            
            this.consume('R_EXPRESSION');
            
            return {
                type: 'JS',
                value: content
            };
        }

        if (token.type === 'ESPACIO') {
            this.consume('ESPACIO');
            return {
                type: 'Literal',
                value: ' ',
                raw: ' '
            }
        }

        if (token.type === 'INTRO') {
            this.consume('INTRO');
            return {
                type: 'Literal',
                value: '\\n',
                raw: '\\n'
            }
        }

        if (token.type === 'SUPER') {
            this.current++;
            return this.parseIdentifierOrCall({ type: 'Super', value: 'super' });
        }

        if (token.type === 'ESTA') {
            const estaNode: ASTNode<T, N> = { type: 'Esta', value: 'this' };
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
                type: 'Nuevo',
                object: call
            };
        }

        if (token.type === 'NO') {
            this.consume('NO');
            const argument = this.parsePrimary();

            return {
                type: 'NoUnario',
                operator: 'NO',
                object: argument
            };
        }

        if (token.type === 'TIPO') {
            this.consume('TIPO');
            const argument = this.parsePrimary();

            return {
                type: 'Unario',
                operator: 'TIPO',
                object: argument
            };
        }

        if (token.type === 'L_SQUARE') {
            this.consume('L_SQUARE');
            const elements: ASTNode<T, N>[] = [];
            while (this.peek().type !== 'R_SQUARE') {
                elements.push(this.parseExpression());
                if (this.peek().type === ',') this.consume(',');
            }
            this.consume('R_SQUARE');
            return {
                type: 'Lista',
                body: elements
            };
        }

        if (token.type === 'L_EXPRESSION') {
            this.consume('L_EXPRESSION');
            
            const node = this.parseExpression(); 
            
            this.consume('R_EXPRESSION');

            return {
                type: 'Expresion',
                object: node,
            };
        }

        if (token.type === 'L_BRACE') {
            this.consume('L_BRACE');
            const properties: ObjectProperty<T, N>[] = [];

            while (this.peek().type !== 'R_BRACE') {
                const keyToken = this.consume(['TEXTO', 'IDENTIFICADOR']);
                const key = keyToken.type === 'TEXTO' ? `"${keyToken.value}"` : keyToken.value;
                
                this.consume(':');
                const value = this.parseExpression();
                
                properties.push({ key, value });

                if (this.peek().type === ',') {
                    this.consume(',');
                }
            }

            this.consume('R_BRACE');

            return {
                type: 'Objeto',
                properties
            } as ObjectNode;
        }
        
        throw new Error(`Token inesperado en expresión: ${token.type} en la posición ${this.current}`);
    }

    private parseIdentifierOrCall(startNode?: IdentificatorNode | NewNode | ThisNode | SuperNode): ASTNode<T, N> {
        let node: ASTNode<T, N> = startNode || { type: 'Identificador', value: this.consume('IDENTIFICADOR').value };

        while (this.current < this.tokens.length) {
            const next = this.peek();

            if (next.type === '.') {
                this.consume('.');
                const property = this.consume('IDENTIFICADOR');
                
                node = {
                    type: 'Acceso',
                    object: node,
                    property: property.value
                };
            } else if (next.type === 'L_SQUARE') {
                this.consume('L_SQUARE');
                const index = this.parseExpression();
                this.consume('R_SQUARE');

                node = {
                    type: 'AccesoPorIndice',
                    object: node,
                    index: index
                };
            } else {
                break;
            }
        }

        if (this.current < this.tokens.length && this.peek().type === 'L_EXPRESSION') {
            this.consume('L_EXPRESSION');
            
            const args: ASTNode<T, N>[] = [];
            while (this.peek().type !== 'R_EXPRESSION') {
                args.push(this.parseExpression());
                if (this.current < this.tokens.length && this.peek().type === ',') {
                    this.consume(',');
                }
            }
            this.consume('R_EXPRESSION');

            return {
                type: 'Llamada',
                object: node,
                params: args
            };
        }

        return node;
    }

    private parseLiteral(): ASTNode<T, N> {
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
            type: 'Literal',
            value,
            raw: token.value
        };
    }

    private parseVariableDeclaration(): VariableNode<T, N> {
        this.consume('VAR');
        const id = this.consume('IDENTIFICADOR').value;
        
        let value: ASTNode<T, N> = { type: 'Literal', value: undefined, raw: 'indefinido' };

        if (this.current < this.tokens.length && this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression();
        }

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Variable
        });

        return {
            type: 'Variable',
            id,
            value
        };
    }

    private parseIfStatement(): ConditionNode<T, N> {
        this.consume('SI');
        this.consume('L_EXPRESSION');

        const test = this.parseExpression();

        this.consume('R_EXPRESSION');
        this.consume('L_BRACE');

        const consequent: ASTNode<T, N>[] = [];

        while (this.peek().type !== 'R_BRACE') {
            consequent.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        let alternate: ASTNode<T, N>[] | ConditionNode<T, N> | undefined = undefined;

        if (this.current < this.tokens.length && (this.peek().type === 'SINO' || this.peek().type === 'ADEMAS')) {
            const next = this.consume(this.peek().type);

            if (next.type === 'ADEMAS') {
                alternate = this.parseIfStatement();
            } else {
                this.consume('L_BRACE');

                const elseBody: ASTNode<T, N>[] = [];

                while (this.peek().type !== 'R_BRACE') {
                    elseBody.push(this.parseStatement());
                }

                this.consume('R_BRACE');
                alternate = elseBody;
            }
        }

        return {
            type: 'Condicion',
            test,
            consequent,
            alternate
        };
    }

    private parseForStatement(): LoopNode<T, N> {
        this.consume('PARA');
        this.consume('L_EXPRESSION');
        
        const variable = this.consume('IDENTIFICADOR').value;

        this.consume('EN');
        
        const iterable = this.parseExpression();
        
        this.consume('R_EXPRESSION');
        this.consume('L_BRACE');

        const body: ASTNode<T, N>[] = [];

        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        return {
            type: 'Bucle',
            var: variable,
            iterable,
            body
        };
    }
}