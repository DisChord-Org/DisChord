import { SubParser } from "../../subparser";
import { LoopNode, ASTNode } from "../../../types";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../parser";

export class LoopParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'PARA';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(): LoopNode<T, N> {
        this.consume('PARA');
        this.consume('L_EXPRESSION');
        
        const variable = this.consume('IDENTIFICADOR', "Se debe especificar un nombre para la variable del bucle.").value;
        this.consume('EN', "Se esperaba la palabra 'en' para definir el iterable.");
        
        const iterable = this.parent.parseExpression();
        this.consume('R_EXPRESSION');

        const body = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;

        return this.createNode<LoopNode<T, N>>({
            type: 'Bucle',
            var: variable,
            iterable,
            body
        });
    }
}