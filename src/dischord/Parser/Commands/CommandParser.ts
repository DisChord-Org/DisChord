import { ASTNode } from "../../../chord/types";
import { DisChordParser } from "../parser";
import { CommandNode, CommandOptionNode, CommandParam, DisChordASTNode } from "../../types";
import { KeyWords } from "../../../chord/keywords";
import { SubParser } from "../subparser";

/**
 * The Commands Parser.
 * This class handles the extraction of command names, descriptions, options and executions.
 */
export default class CommandParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "comando";

    /**
     * @param parent - The main DisChordParser context for token expression handling
     */
    constructor (protected parent: DisChordParser) {
        super(parent);
    }

    /**
     * Injects DisChord-specific keywords into the global system 
     * so the Lexer can correctly identify them as tokens.
     * This method is called by DisChordParser.
     */
    public static injectStatements () {
        KeyWords.addStatements([ "comando" ]);
    }

    /**
     * Parses a command creation block.
     * Expected structure: `crear comando <nombre> {...}`
     * @returns {CommandNode} The AST node representing the command definition.
     */
    parse (): CommandNode {
        this.consume('COMANDO');
        const commandName = this.consume('IDENTIFICADOR').value;
    
        this.consume('L_BRACE');
    
        const body: DisChordASTNode[] = [];
        const params: CommandParam[] = [];
            
        while (this.peek().type !== 'R_BRACE') {
            switch (this.peek().value) {
                case 'descripcion':
                    this.consume('IDENTIFICADOR');
                    const value: DisChordASTNode = this.parsePrimary();
    
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

    /**
     * Parses individual command options
     * Expected structure: `nameOption: {...}`
     * @private
     * @returns {CommandOptionNode} The parsed option configuration.
     * @throws {Error} If required properties are missing or types are invalid.
     */
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
}