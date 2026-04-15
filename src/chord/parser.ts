import { ChordError, ErrorLevel } from "../ChordError";
import { SUGGESTIONS } from "./core.lib";
import { KeyWords } from "./keywords";
import { ASTNode, ClassNode, ConditionNode, LoopNode, FunctionNode, PropertyNode, Token, VariableNode, Symbol, SymbolKind, IdentificatorNode, NewNode, ThisNode, SuperNode, ReturnNode, ExportNode, ImportNode, ExitLoopNode, PassLoopNode, AssignmentNode, BinaryExpressionNode, JSNode, LiteralNode, NoUnaryNode, UnaryNode, ListNode, ExpressionNode, AccessNode, AccessNodeByIndex, CallNode, SOF, EOF, ODBNode } from "./types";

export class Parser<T = never, N = never> {
    public symbols: Map<string, Symbol> = new Map();
    public nodes: ASTNode<T, N>[] = [];

    constructor(
        private tokens: Token[],
        public input: string,
        private current: number = 0
    ) {}

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

    peek(type: 'this' | 'next' | 'prev' = 'this'): Token {
        let targetIndex = this.current;

        if (type === 'next') targetIndex = this.current + 1;
        if (type === 'prev') targetIndex = this.current - 1;

        if (targetIndex < 0) {
            return {
                type: 'SOF',
                value: '',
                location: {
                    line: 1,
                    column: 1
                }
            } as SOF<T>;
        }

        if (targetIndex >= this.tokens.length) {
            return {
                type: 'EOF',
                value: '',
                location: this.tokens[this.tokens.length - 1]?.location || { line: 1, column: 1 }
            } as EOF<T>;
        }

        return this.tokens[targetIndex];
    }

    consume(expectedTypes: string | string[], message?: string): Token {
        const token = this.peek();
        const expected = Array.isArray(expectedTypes) ? expectedTypes : [expectedTypes];

        if (expected.includes(token.type)) return this.tokens[this.current++];

        let customMessage = message;
    
        if (!customMessage) {
            const hint = SUGGESTIONS[expected[0]];
            customMessage = hint
                ? hint
                : `Esperaba un elemento de tipo '${expected.join(' o ')}'`;
        }

        throw new ChordError(
            ErrorLevel.Parser,
            `${customMessage}. (En su lugar se encontró '${token.value}')`,
            token.location,
            this.input.split('\n')[token.location.line - 1] || ''
        ).format();
    }

    public createNode<NodeType extends ASTNode<T, N>> (node: Omit<NodeType, 'location'>): NodeType {
        const token: Token = this.peek('prev');

        return {
            ...node,
            location: token.location
        } as NodeType;
    }

    protected parseCustomStatement(): ASTNode<T, N> | null {
        return null;
    }

    parseStatement(classContext?: string): ASTNode<T, N> {
        const token = this.peek();

        const custom = this.parseCustomStatement();
        if (custom) return custom;

        if (token.type === 'DECORADOR' && token.value === '@asincrono') {
            this.consume('DECORADOR', `Solo existe un decorador. ¿Querías decir '@asincrono'?`);
            
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
            return this.createNode<ExitLoopNode<T>>({ type: 'Salir' });
        }

        if (token.type === 'PASAR') {
            this.consume('PASAR');
            return this.createNode<PassLoopNode<T>>({ type: 'Pasar' });
        }

        if (token.type === 'DEVOLVER') {
            this.consume('DEVOLVER',);
            
            const next = this.peek();
            let value = undefined;
            
            if (next.type !== 'R_BRACE' && next.type !== 'SINO' && next.type !== 'ADEMAS') {
                value = this.parseExpression();
            }

            return this.createNode<ReturnNode<T, N>>({
                type: 'Devolver',
                object: value
            });
        }

        if (token.type === 'EXPORTAR') {
            this.consume('EXPORTAR');
            const declaration = this.parseStatement();
            
            return this.createNode<ExportNode<T, N>>({
                type: 'Exportar',
                object: declaration
            });
        }

        if (token.type === 'IMPORTAR') {
            this.consume('IMPORTAR');
            this.consume('L_BRACE', `Después de querer importar debes usar '{'`);

            const identificators: string[] = [];
            while (this.peek().type !== 'R_BRACE') {
                identificators.push(this.consume('IDENTIFICADOR').value);
                if (this.peek().type === ',') this.consume(',');
            }

            this.consume('R_BRACE');
            this.consume('DESDE', `Después de usar 'importar' debes especificar la ruta del fichero a importar usando 'desde'.`);
            
            const pathToken = this.consume('TEXTO', `Debes especificar un 'texto' con la ruta del fichero a importar.`); 
            const modulePath = pathToken.value;

            return this.createNode<ImportNode<T, N>>({
                type: 'Importar',
                identificators,
                path: modulePath
            });
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
        
        const id = this.consume('IDENTIFICADOR', 'Se debe especificar el nombre de la clase').value;
        
        let superClass = undefined;
        if (this.current < this.tokens.length && this.peek().type === 'EXTIENDE') {
            this.consume('EXTIENDE');
            superClass = this.consume('IDENTIFICADOR', `Se debe especificar el nombre de la clase padre`).value;
        }

        this.consume('L_BRACE', `Al declarar una clase debes usar '{'.`);

        const body: ASTNode<T, N>[] = [];
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement(id));
        }

        this.consume('R_BRACE');

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Class
        });

        return this.createNode<ClassNode<T, N>>({
            type: 'Clase',
            id,
            superClass,
            body
        });
    }

    private parseFunctionDeclaration(isConstructor: boolean, isMethod: boolean = true, isAsync: boolean = false): FunctionNode<T, N> {
        let id: string;
        
        if (isConstructor) {
            id = this.consume('IDENTIFICADOR', `Se debe especificar el nombre del constructor`).value;
        } else {
            this.consume('FUNCION');
            id = this.consume('IDENTIFICADOR', `Se debe especificar el nombre de la función`).value;
        }

        this.consume('L_EXPRESSION', `Al declarar una función se debe usar '(' para arbir la lista de parámetros.`);

        const params: string[] = [];
        while (this.peek().type !== 'R_EXPRESSION') {
            params.push(this.consume('IDENTIFICADOR', `Se debe especificar el nombre del parámetro`).value);
            if (this.peek().type === ',') this.consume(',');
        }

        this.consume('R_EXPRESSION');
        this.consume('L_BRACE', `Al declarar una función debes usar '{' para abrir el bloque de código de la función.`);

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

        return this.createNode<FunctionNode<T, N>>({
            type: 'Funcion',
            id,
            metadata: {
                isConstructor,
                isMethod,
                isAsync
            },
            params,
            body
        });
    }

    private parseProperty(): PropertyNode<T, N> {
        this.consume('PROP');
        const id = this.consume('IDENTIFICADOR', `Se debe especificar el nombre de la propiedad`).value;
        
        let value = this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value: undefined,
            raw: 'indefinido'
        });

        if (this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression() as LiteralNode<T>;
        }

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Property
        });

        return this.createNode<PropertyNode<T, N>>({
            type: 'Propiedad',
            id,
            value
        });
    }

    private parseExpression(): ASTNode<T, N> {
        let left = this.parsePrimary();

        const binaryExpressions = [
            'MAS', 'MENOS', 'POR', 'ENTRE', 'RESTO', 'EXP', 'INTRO', 'ESPACIO',
            'MAYOR', 'MENOR', 'MAYOR_IGUAL', 'MENOR_IGUAL', 'IGUAL', 'IGUAL_TIPADO', 'NO_IGUAL', 'NO_IGUAL_TIPADO', 'DIFERENTE', 'Y', 'O'
        ];

        while (this.current < this.tokens.length && binaryExpressions.includes(this.peek().type)) {
            const operator = this.consume(this.peek().type, `Se esperaba un operador binario`);
            const right = this.parsePrimary();
            
            left = this.createNode<BinaryExpressionNode<T, N>>({
                type: 'ExpresionBinaria',
                left,
                operator: operator.type,
                right
            });
        }

        if (this.current < this.tokens.length && this.peek().type === 'ES') {
            this.consume('ES');
            const value = this.parseExpression();
            
            return this.createNode<AssignmentNode<T, N>>({
                type: 'Asignacion',
                left,
                assignment: value
            });
        }

        return left;
    }

    parsePrimary(): ASTNode<T, N> {
        const token = this.peek();

        if (token.value === 'js') {
            this.consume('JS');
            this.consume('L_EXPRESSION', `Después de usar el escape a JS se debe abrir una expresión.`);
            
            const content = this.consume('TEXTO', `Se debe especificar el contenido de la expresión JS`).value; 
            
            this.consume('R_EXPRESSION');
            
            return this.createNode<JSNode<T>>({
                type: 'JS',
                value: content
            });
        }

        if (token.type === 'ESPACIO') {
            this.consume('ESPACIO');
            return this.createNode<LiteralNode<T>>({
                type: 'Literal',
                value: ' ',
                raw: ' '
            });
        }

        if (token.type === 'INTRO') {
            this.consume('INTRO');
            return this.createNode<LiteralNode<T>>({
                type: 'Literal',
                value: '\\n',
                raw: '\\n'
            });
        }

        if (token.type === 'SUPER') {
            this.consume('SUPER');
            return this.parseIdentifierOrCall(
                this.createNode<SuperNode<T>>({
                    type: 'Super',
                    value: 'super'
                })
            );
        }

        if (token.type === 'ESTA') {
            this.consume('ESTA');
            const estaNode = this.createNode<ThisNode<T>>({
                type: 'Esta',
                value: 'this'
            });

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
            return this.createNode<NewNode<T, N>>({
                type: 'Nuevo',
                object: call
            });
        }

        if (token.type === 'NO') {
            this.consume('NO');
            const argument = this.parsePrimary();

            return this.createNode<NoUnaryNode<T, N>>({
                type: 'NoUnario',
                operator: 'NO',
                object: argument
            });
        }

        if (token.type === 'TIPO') {
            this.consume('TIPO');
            const argument = this.parsePrimary();

            return this.createNode<UnaryNode<T, N>>({
                type: 'Unario',
                operator: 'TIPO',
                object: argument
            });
        }

        if (token.type === 'L_SQUARE') {
            this.consume('L_SQUARE');
            const elements: ASTNode<T, N>[] = [];
            while (this.peek().type !== 'R_SQUARE') {
                elements.push(this.parseExpression());
                if (this.peek().type === ',') this.consume(',');
            }
            this.consume('R_SQUARE');
            return this.createNode<ListNode<T, N>>({
                type: 'Lista',
                body: elements
            });
        }

        if (token.type === 'L_EXPRESSION') {
            this.consume('L_EXPRESSION');
            
            const node = this.parseExpression(); 
            
            this.consume('R_EXPRESSION');

            return this.createNode<ExpressionNode<T, N>>({
                type: 'Expresion',
                object: node,
            });
        }

        if (token.type === 'L_BRACE') return this.parseODB();
        
        throw new ChordError(
            ErrorLevel.Parser,
            `Token inesperado en expresión: ${token.type} en la posición ${this.current}`,
            token.location,
            this.input.split('\n')[token.location.line - 1] || ''
        ).format();
    }

    private parseIdentifierOrCall(startNode?: ASTNode<T, N>): ASTNode<T, N> {
        let node = startNode || this.createNode<IdentificatorNode<T>>({ type: 'Identificador', value: this.consume('IDENTIFICADOR').value });

        while (this.current < this.tokens.length) {
            const next = this.peek();

            if (next.type === '.') {
                this.consume('.');
                const property = this.consume('IDENTIFICADOR', `Después de '.' se esperaba un identificador para acceder a la propiedad`);
                
                node = this.createNode<AccessNode<T, N>>({
                    type: 'Acceso',
                    object: node,
                    property: property.value
                });
            } else if (next.type === 'L_SQUARE') {
                this.consume('L_SQUARE');
                const index = this.parseExpression();
                this.consume('R_SQUARE');

                node = this.createNode<AccessNodeByIndex<T, N>>({
                    type: 'AccesoPorIndice',
                    object: node,
                    index: index
                });
            } else break;
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

            return this.createNode<CallNode<T, N>>({
                type: 'Llamada',
                object: node,
                params: args
            });
        }

        return node;
    }

    private parseLiteral(): ASTNode<T, N> {
        const token = this.consume(['NUMERO', 'TEXTO', 'BOOL', 'INDEFINIDO'], `Se esperaba un literal (número, texto, booleano o indefinido)`);

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

        return this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value,
            raw: token.value
        });
    }

    private parseVariableDeclaration(): VariableNode<T, N> {
        this.consume('VAR');
        const id = this.consume('IDENTIFICADOR', `Se debe especificar un nombre para la variable`).value;
        
        let value = this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value: undefined,
            raw: 'indefinido'
        });

        if (this.current < this.tokens.length && this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression() as LiteralNode<T>;
        }

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Variable
        });

        return this.createNode<VariableNode<T, N>>({
            type: 'Variable',
            id,
            value
        });
    }

    private parseIfStatement(): ConditionNode<T, N> {
        this.consume('SI');
        this.consume('L_EXPRESSION', `Después de 'si' se debe abrir una expresión con '(' para especificar la condición.`);

        const test = this.parseExpression();

        this.consume('R_EXPRESSION');
        this.consume('L_BRACE', `Después de la condición de un 'si' se debe abrir un bloque de código con '{'.`);

        const consequent: ASTNode<T, N>[] = [];

        while (this.peek().type !== 'R_BRACE') {
            consequent.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        let alternate: ConditionNode<T, N>['alternate'] = undefined;

        if (this.current < this.tokens.length && (this.peek().type === 'SINO' || this.peek().type === 'ADEMAS')) {
            const next = this.consume(this.peek().type);

            if (next.type === 'ADEMAS') {
                alternate = this.parseIfStatement();
            } else {
                this.consume('L_BRACE', `Después de 'sino' se debe abrir un bloque de código con '{'.`);

                const elseBody: ASTNode<T, N>[] = [];

                while (this.peek().type !== 'R_BRACE') {
                    elseBody.push(this.parseStatement());
                }

                this.consume('R_BRACE');
                alternate = elseBody;
            }
        }

        return this.createNode<ConditionNode<T, N>>({
            type: 'Condicion',
            test,
            consequent,
            alternate
        });
    }

    private parseForStatement(): LoopNode<T, N> {
        this.consume('PARA');
        this.consume('L_EXPRESSION');
        
        const variable = this.consume('IDENTIFICADOR', `Se debe especificar un nombre para la variable del bucle`).value;

        this.consume('EN', `Después de la variable del bucle se debe usar 'en' para especificar el iterable.`);
        
        const iterable = this.parseExpression();
        
        this.consume('R_EXPRESSION');
        this.consume('L_BRACE', `Después de la expresión de un 'para' se debe abrir un bloque de código con '{'.`);

        const body: ASTNode<T, N>[] = [];

        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }

        this.consume('R_BRACE');

        return this.createNode<LoopNode<T, N>>({
            type: 'Bucle',
            var: variable,
            iterable,
            body
        });
    }

    /**
     * Parses an ODB.
     * Distinguishes between property blocks (key-value pairs) and execution statements.
     * @returns {ODBNode} A node containing organized blocks and an executable body.
     */
    parseODB(type: 'definition-only' | 'definition-code' = 'definition-code'): ODBNode<T, N> {
        this.consume('L_BRACE');
    
        const blocks: Record<string, ASTNode<T, N>> = {};
        const body: ASTNode<T, N>[] = [];
        let definitionMode: boolean = true;

        while (this.peek().type !== 'R_BRACE') {
            if (definitionMode && this.isPropertyAssignment()) {
                const key = this.consume('IDENTIFICADOR').value;

                const value = this.parsePrimary();
                blocks[key] = value;
            } else {
                if (type === 'definition-only') throw new ChordError(
                    ErrorLevel.Parser,
                    `Se definió código en un BDO 'definition-only'`,
                    this.peek().location,
                    this.input.split('\n')[this.peek().location.line - 1] || ''
                ).format();

                definitionMode = false;
    
                const statement = this.parseStatement();
                if (statement) body.push(statement);
            }
        }
    
        this.consume('R_BRACE');
    
        return this.createNode<ODBNode<T, N>>({
            type: 'BDO',
            blocks,
            body
        });
    }

    /**
     * Predicate to distinguish between a property assignment and a statement.
     * Looks a token forward to decide.
     */
    private isPropertyAssignment(): boolean {
        const current = this.peek();
        const next = this.peek('next');

        if (current.type !== 'IDENTIFICADOR') return false;
        if (KeyWords.getStatements().includes(current.value)) return false;
        if (next.type === '.' || next.type === 'L_EXPRESSION') return false;
        if (next.type === 'ES') return false; 

        const validValueTypes = ['LITERAL', 'L_BRACE', 'L_SQUARE', 'IDENTIFICADOR', 'TEXTO', 'NUMERO', 'BOOLEANO'];

        return validValueTypes.includes(next.type);
    }
}