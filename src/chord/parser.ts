import { ChordError, ErrorLevel } from "../ChordError";
import { SUGGESTIONS } from "./core.lib";
import { DecoratorProcessor } from "./DecoratorProcessor";
import { ASTNode, ClassNode, ConditionNode, LoopNode, FunctionNode, PropertyNode, Token, VariableNode, Symbol, SymbolKind, IdentificatorNode, NewNode, ThisNode, SuperNode, ReturnNode, ExportNode, ImportNode, ExitLoopNode, PassLoopNode, AssignmentNode, BinaryExpressionNode, JSNode, LiteralNode, NoUnaryNode, UnaryNode, ListNode, ExpressionNode, AccessNode, AccessNodeByIndex, CallNode, SOF, EOF, ODBNode, ODBMode } from "./types";

class Parser<T = never, N = never> {
    public nodes: ASTNode<T, N>[] = [];

    constructor(
        private tokens: Token[],
        private current: number = 0
    ) {}


    parseStatement(classContext?: string): ASTNode<T, N> {
        const token = this.peek();
        const custom = this.parseCustomStatement(); // IMPORTANTE

        if (custom) return custom;


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
            const identificators: string[] = [];
            const isDestructured = this.peek().type === 'L_BRACE';

            if (isDestructured) {
                this.consume('L_BRACE');
                while (this.peek().type !== 'R_BRACE') {
                    identificators.push(this.consume('IDENTIFICADOR', "Se esperaba un nombre de variable para importar").value);
                    if (this.peek().type === ',') this.consume(',');
                }
                this.consume('R_BRACE');
            } else {
                identificators.push(this.consume('IDENTIFICADOR', "Después de 'importar' debe ir '{' o el nombre de una variable").value);
            }

            this.consume('DESDE', `Se esperaba la palabra 'desde' después de los identificadores.`);

            const pathToken = this.consume('TEXTO', `Debes especificar la ruta entre comillas (texto).`);
            const modulePath = pathToken.value;

            return this.createNode<ImportNode<T, N>>({
                type: 'Importar',
                identificators,
                path: modulePath,
                isDestructured
            });
        }

        if (classContext && token.type === 'IDENTIFICADOR' && token.value === classContext) {
            if (this.cursor + 1 < this.tokens.length && this.tokens[this.cursor + 1].type === 'L_EXPRESSION') {
                return this.parseFunctionDeclaration(true);
            }
        }

        return this.parseExpression();
    }

    private parseClassDeclaration(): ClassNode<T, N> {
        this.consume('CLASE');
        
        const id = this.consume('IDENTIFICADOR', 'Se debe especificar el nombre de la clase').value;
        
        let superClass = undefined;
        if (this.cursor < this.tokens.length && this.peek().type === 'EXTIENDE') {
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

        if (this.cursor < this.tokens.length && (this.peek().type === 'SINO' || this.peek().type === 'ADEMAS')) {
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
}