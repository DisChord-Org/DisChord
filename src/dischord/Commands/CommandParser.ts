import { ASTNode } from "../../chord/types";
import { DisChordParser } from "../parser";
import { CommandNode, CommandOptionNode, CommandParam } from "../types";

export default class CommandParser {
    constructor (private ctx: DisChordParser) {}

    parse (): CommandNode {
        this.ctx.consume('IDENTIFICADOR');
        const commandName = this.ctx.consume('IDENTIFICADOR').value;
    
        this.ctx.consume('L_BRACE');
    
        const body: ASTNode[] = [];
        const params: CommandParam[] = [];
            
        while (this.ctx.peek().type !== 'R_BRACE') {
            switch (this.ctx.peek().value) {
                case 'descripcion':
                    this.ctx.consume('IDENTIFICADOR');
                    const value: ASTNode = this.ctx.parsePrimary();
    
                    const param: CommandParam = {
                        type: 'ParametroDeComando',
                        property: 'Descripcion',
                        value
                    };
    
                    params.push(param);
                    break;
                case 'opciones':
                    this.ctx.consume('IDENTIFICADOR');
                    const options: CommandOptionNode[] = [];
    
                    this.ctx.consume('L_BRACE');
                    while (this.ctx.peek().type !== 'R_BRACE') {
                        options.push(this.parseCommandOption());
                    }
                    this.ctx.consume('R_BRACE');
    
                    const optionsParam: CommandParam = {
                        type: 'ParametroDeComando',
                        property: 'Opciones',
                        options
                    }
    
                    params.push(optionsParam);
                    break;
                default:
                    body.push(this.ctx.parseStatement());
            }
        }
    
        this.ctx.consume('R_BRACE');
        return {
            type: 'CrearComando',
            value: commandName,
            body,
            params
        }
    }

    private parseCommandOption(): CommandOptionNode {
        const name = this.ctx.consume('IDENTIFICADOR').value;
        const option: Partial<CommandOptionNode> = {
            type: 'ParametroDeComando',
            name
        };
    
        // this part needs to be refactor.
        // actually, you just can set one type of option and the rest of properties in any order.
        this.ctx.consume('L_BRACE');
        while (this.ctx.peek().type !== 'R_BRACE') {
            const token = this.ctx.peek();
    
            switch (token.value) {
                case 'tipo':
                    this.ctx.consume('TIPO');
                    const type = this.ctx.parsePrimary();
                    if (type.type != 'Literal') throw new Error(`El tipo de opción de comando debe ser un literal, se encontró '${type.type}'`);
                    if (type.value != 'Texto') throw new Error(`Actualmente solo se soporta el tipo 'Texto' para opciones de comando, se encontró '${type.value}'`);
                    option.property = type.value;
                    break;
                case 'descripcion':
                    this.ctx.consume('IDENTIFICADOR');
                    option.description = this.ctx.parsePrimary();
                    break;
                case 'requerido':
                    this.ctx.consume('IDENTIFICADOR');
                    option.required = this.ctx.parsePrimary();
                    break;
                default:
                    throw new Error(`Dentro de las opciones de comando solo se permiten 'tipo', 'descripcion' y 'requerido', se encontró '${token.value}'`);
            }
        }
        this.consume('R_BRACE');
    
        if (!option.property || !option.description || option.required === undefined) throw new Error(`Faltan propiedades para la opción de comando '${name}'`);
    
        return option as CommandOptionNode;
    }
    consume(arg0: string) {
        throw new Error("Method not implemented.");
    }
}