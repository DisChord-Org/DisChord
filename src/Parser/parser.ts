import { ASTNode, Token } from "src/Types/Token";
import { array_operators, comparation_operators, object_operators, operators, statements, types } from "../Lexer/types"
import { readdirSync } from "fs";
import path from "path";

const functions: string[] = [];

export class Parser {
    public nodes: ASTNode[] = [];
    // private functions: string[] = [];

    constructor(private tokens: Token[], private current: number = 0) {}

    public parse(): ASTNode[] {

        while (this.current < this.tokens.length) {
            switch (this.peek().type) {
                case statements.CONSOLA:
                case statements.TIPO:
                case statements.DEVOLVER:
                    const statement = this.consume(this.peek().type);

                    if (statement.type === statements.CONSOLA && this.peek().type === statements.LIMPIAR) {
                        this.consume(statements.LIMPIAR);

                        this.nodes.push(
                            {
                                type: statement.type,
                                value: 'EXPRESION',
                                children: [
                                    {
                                        type: statements.LIMPIAR,
                                        value: statements.LIMPIAR
                                    }
                                ]
                            }
                        );

                        break;
                    }

                    if (this.peek().type === statements.L_EXPRESSION) {
                        let expressionArray = this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION);
                        this.nodes.push(
                            {
                                type: statement.type,
                                value: 'EXPRESION',
                                children: expressionArray
                            }
                        );
                    } else this.nodes.push(
                        {
                            type: statement.type,
                            value: 'EXPRESION',
                            children: [ this.peek().type === statements.L_BRACE? this.parseObject() : this.consume(types) ]
                        }
                    );

                    break;
                case statements.L_EXPRESSION:
                    const expression: any = this.blocks('L_EXPRESSION', 'R_EXPRESSION');
                    
                    this.nodes.push(expression);
                    break;
                case statements.SI:
                    this.consume(statements.SI);
                    const conditionExpression: any = this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION);
                    let block: any = this.blocks(statements.L_BRACE, statements.R_BRACE);
                    let elseIf: any = [];
                    let elseBlock: any;

                    if(this.current < this.tokens.length) {
                        while (this.peek().type === statements.ADEMAS) {
                            this.consume(statements.ADEMAS);
                            this.consume(statements.SI);
                            const elseIfCondition = this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION);
                            const elseIfBlock = this.blocks(statements.L_BRACE, statements.R_BRACE);
                            elseIf.push({ value: elseIfCondition, children: elseIfBlock });
                        }

                        if (this.peek().type === statements.SINO) {
                            this.consume(statements.SINO);
                            elseBlock = this.blocks(statements.L_BRACE, statements.R_BRACE);
                        }
                    }

                    this.nodes.push(
                        {
                            type: "SI",
                            value: conditionExpression,
                            children: block,
                            elseif: elseIf,
                            else: elseBlock
                        }
                    );
                    break;
                case statements.VAR:
                    this.consume(statements.VAR);
                    const varName: any = this.consume(this.peek().type);
                    this.consume(comparation_operators.IGUAL);
                    let content: any;

                    if (this.peek().type === statements.L_EXPRESSION) {
                        content = this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION);
                    } else {
                        content = this.consume(this.peek().type);
                    }

                    this.nodes.push(
                        {
                            type: "VAR",
                            value: varName.value,
                            content: content
                        }
                    );

                    break;
                case statements.MIENTRAS:
                case statements.CADA:
                    const statementType = this.consume(this.peek().type);
                    const condition: any = this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION);
                    const body: any = this.blocks(statements.L_BRACE, statements.R_BRACE);

                    this.nodes.push(
                        {
                            type: statementType.type,
                            value: condition,
                            children: body
                        }
                    );

                    break;
                case statements.PORCADA:
                    this.consume(statements.PORCADA);
                    const value = this.consume(this.peek().type);
                    this.consume(this.peek().type);
                    const name = this.consume(this.peek().type);
                    const eachblock: any = this.blocks(statements.L_BRACE, statements.R_BRACE);
                    const arr: any = [ name, value ];

                    this.nodes.push(
                        {
                            type: statements.PORCADA,
                            value: arr,
                            children: eachblock
                        }
                    );
                    break;
                case statements.SEPARADOR:
                    this.consume(statements.SEPARADOR);
                    break;

                case statements.FUNCION:
                    this.consume(statements.FUNCION);
                    const functionName: any = this.consume(this.peek().type);
                    const params: any = (this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION)).filter(block => block.type != 'SEPARADOR');
                    const funcBody: any = this.blocks(statements.L_BRACE, statements.R_BRACE);

                    functions.push(functionName);

                    this.nodes.push(
                        {
                            type: statements.FUNCION,
                            value: functionName.type,
                            children: [ params, funcBody ]
                        }
                    );
                    break;

                case operators.MAS:
                case operators.MENOS:
                case operators.POR:
                case operators.ENTRE:
                case operators.EXP:
                case operators.RESTO:

                case comparation_operators.IGUAL:
                case comparation_operators.IGUAL_TIPADO:
                case comparation_operators.MAYOR:
                case comparation_operators.MAYOR_IGUAL:
                case comparation_operators.MENOR:
                case comparation_operators.MENOR_IGUAL:
                case comparation_operators.NO:
                case comparation_operators.O:
                case comparation_operators.Y:
                case array_operators.EMPUJAR:
                case array_operators.EMPUJAR_PRINCIPIO:
                case array_operators.CONCATENAR:
                case array_operators.INDEXAR:
                case array_operators.INCLUYE:
                case array_operators.ALGUNO:
                case array_operators.TODOS:
                case array_operators.BUSCAR:
                case array_operators.BUSCAR_INDEX:
                case array_operators.FILTRAR:
                case array_operators.CLASIFICAR:
                    this.parseOperator(this.peek().type);
                    break;

                case array_operators.LONGITUD:
                case array_operators.CORTAR_FINAL:
                case array_operators.CORTAR_PRINCIPIO:
                    this.parseLeftOperator(this.peek().type);
                    break;

                case "NUMERO":
                case "BIGINT":
                case "BOOL":
                case "TEXTO":
                case "LISTA":
                case "NULO":
                case "INDEFINIDO":
                    this.nodes.push(this.consume(this.peek().type));
                    break;
                case statements.L_BRACE:
                    this.nodes.push(this.parseObject());
                    break;

                case array_operators.MODIFICAR:
                    this.consume(array_operators.MODIFICAR);
                    const arrayToModify = this.consume(this.peek().type);
                    this.consume(array_operators.POSICION);
                    const position = this.consume(this.peek().type);
                    this.consume(comparation_operators.IGUAL);
                    const equal = this.consume(this.peek().type);
                    const array: any = [ arrayToModify, position, equal ];

                    this.nodes.push(
                        {
                            type: array_operators.MODIFICAR,
                            value: array
                        }
                    );
                    break;

                case object_operators.ESTABLECER:
                    this.consume(object_operators.ESTABLECER);
                    const obj: any = this.parseObject();
                    this.consume('EN');
                    const objVarName: any = this.consume(this.peek().type);

                    this.nodes.push(
                        {
                            type: object_operators.ESTABLECER,
                            value: objVarName,
                            children: obj
                        }
                    );
                    break;

                case object_operators.BORRAR:
                    this.consume(object_operators.BORRAR);
                    const objName: any = this.consume(this.peek().type);
                    this.consume('DE');
                    const objVar: any = this.consume(this.peek().type);

                    this.nodes.push(
                        {
                            type: object_operators.BORRAR,
                            value: objVar,
                            children: objName
                        }
                    );
                    break;

                case object_operators.TRANSFORMAR:
                case object_operators.VALORES:
                case object_operators.ENTRADAS:
                    const st: any = this.consume(this.peek().type);
                    const stObject: any = this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION);

                    this.nodes.push(
                        {
                            type: st.type,
                            value: stObject
                        }
                    );
                    break;

                default:
                    if (this.peek().type === statements.SEPARADOR) {
                        /*
                        Es posible que el parser intente interpretar el token ";" (o el separador) como si fuera el nombre de una función.

                        Es decir, ejemplo: "saludar(<1 MAS 1>; <1 MAS 1>)"
                        después del primer parámetro, se encuentra el token ";" y, según la próxima condición:

                        Se cumple porque el token siguiente es un L_EXPRESSION (la expresión que sigue al separador).
                        Así, el parser consume el ";" y lo trata como nombre de función, y como evidentemente ";" no está declarado,
                        lanza el error "La función ; no ha sido declarada."

                        La solución es comprobar si el token actual es un separador (es decir, el token ";") y, en ese caso, simplemente consumirlo e ignorarlo.
                        */
                        this.consume(statements.SEPARADOR);
                        break;
                    }

                    // Consumir funciones, en caso contrario simplemente se consume y se agrega el nodo.
                    if (this.peek().type && this.current + 1 < this.tokens.length && this.tokens[this.current + 1].type === statements.L_EXPRESSION) {
                        const functionName: any = this.consume(this.peek().type);

                        // Verificar que la función se declaró
                        if (!functions.some((fn: any) => fn.value === functionName.value)) throw new Error(`La función ${functionName.value} no ha sido declarada.`);
                        const params: any = (this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION)).filter(block => block.type != 'SEPARADOR');

                        this.nodes.push({
                            type: functionName.value,
                            value: params?.length > 0 ? params : []
                        });

                    } else {
                        const dependencies = readdirSync(path.join(__dirname, '../../dependencies')).map(dep => {
                            return {
                                name: dep,
                                module: require(path.join(__dirname, `../../dependencies/${dep}/main`))
                            };
                        });

                        if (dependencies.length > 0) {
                            const dependenciesWithStatements = dependencies.filter(({ module }) => {
                                if (!module || typeof module !== 'object') {
                                    console.error('Dependencia corrupta:', { module })
                                    return false;
                                }
                                
                                if (!module.statements) {
                                    console.warn(`La dependencia no tiene statements: ${module.constructor?.name || 'Módulo anónimo'}`);
                                    return false;
                                }
                                
                                return Object.keys(module.statements).includes(this.peek().type);
                            });

                            if (dependenciesWithStatements.length > 0) {
                                const dependency = dependenciesWithStatements[0].module;

                                if (typeof dependency.execParser !== 'function') {
                                    throw new Error(`La dependencia ${dependenciesWithStatements[0].name} no tiene execParser()`);
                                }

                                const dependencyExecution = dependency.execParser(this.tokens, this.current);

                                /*
                                Dependencias deben devolver el siguiente objeto:
                                {
                                    consumeCount: Number // La cantidad de consumiciones exactas empleadas
                                    ast: Object // AST a interpretar.
                                }
                                */

                                this.current += Number(dependencyExecution.consumeCount) || 1;
                                this.nodes.push(dependencyExecution.ast);
                            } else this.nodes.push(this.consume(this.peek().type)); // Consumir token normal
                        } else this.nodes.push(this.consume(this.peek().type)); // Consumir token normal
                    }
            }
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

    private blocks(openType: string, closeType: string) {
        let depth = 1; // Inicializar depth en 1 (ya estamos dentro de la expresión)
        let blockTokens = [];
        this.consume(openType); // Consumir el primer L_EXPRESSION

        while (this.current < this.tokens.length && depth > 0) {
            const token = this.tokens[this.current];

            if (token.type === openType) depth++;
            if (token.type === closeType) depth--;

            if (depth === 0) { // Fin del bloque principal
                this.current++; // Saltar el R_EXPRESSION de cierre
                break;
            }

            blockTokens.push(token); // Añadir tokens internos
            this.current++;
        }

        return new Parser(blockTokens).parse();
    }

    private parseOperator(operator: string) {
        if (operator === 'NO') {
            this.consume('NO');
            let value: any;
    
            if (this.peek().type === 'L_EXPRESSION') {
                value = this.blocks('L_EXPRESSION', 'R_EXPRESSION');
            } else {
                value = this.consume(this.peek().type);
            }
    
            this.nodes.push({
                type: 'NO',
                value: value
            });

            return;
        }

        // this.curret--;
        const left = this.nodes[this.nodes.length - 1];
        this.nodes.pop();
        this.consume(operator);
        let right;

        if(this.peek().type === 'L_EXPRESSION') right = this.blocks('L_EXPRESSION', 'R_EXPRESSION');
        else right = this.consume(this.peek().type);

        this.nodes.push(
            {
                type: operator,
                left: left,
                right: right
            }
        );
    }

    private parseLeftOperator(operator: string) {
        const left = this.nodes[this.nodes.length - 1];
        this.nodes.pop();
        this.consume(operator);

        this.nodes.push(
            {
                type: operator,
                left: left
            }
        );
    }

    private parseObject(): ASTNode {
        const obj: any = { type: "OBJETO", pairs: [] };
        this.consume(statements.L_BRACE);
    
        while (this.current < this.tokens.length && this.peek().type !== statements.R_BRACE) {
            const keyToken = this.consume(this.peek().type);
            const key = keyToken.value;
            this.consume(":");
    
            let value: ASTNode;
            if (this.peek().type === statements.L_BRACE) {
                value = this.parseObject();
            } else if (this.peek().type === statements.L_EXPRESSION) {
                value = {
                    type: "EXPRESION",
                    children: this.blocks(statements.L_EXPRESSION, statements.R_EXPRESSION)
                };
            } else {
                value = this.consume(this.peek().type);
            }
    
            obj.pairs.push({ key, value });
    
            if (this.peek().type === ",") {
                this.consume(",");
            }
        }
    
        this.consume(statements.R_BRACE);
        return obj;
    }    
}