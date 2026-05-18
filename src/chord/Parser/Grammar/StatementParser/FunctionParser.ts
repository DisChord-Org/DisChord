import { SubParser } from "../../subparser";
import { FunctionNode, SymbolKind } from "../../../types";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../parser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";

export class FunctionParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'FUNCION';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    private isConstructor: boolean = false;
    private isMethod: boolean = true;

    public setConstructor (value: boolean): this {
        this.isConstructor = value;
        return this;
    }

    public setMethod (value: boolean): this {
        this.isMethod = value;
        return this;
    }


    public parse(): FunctionNode<T, N> {
        let id: string;

        const flags = {
            constructor: this.isConstructor,
            method: this.isMethod
        };

        this.reset();

        if (flags.constructor) {
            id = this.consume('IDENTIFICADOR', "Se esperaba el nombre del constructor.").value;
        } else {
            this.consume('FUNCION');
            id = this.consume('IDENTIFICADOR', "Se esperaba el nombre de la función.").value;
        }

        this.consume('L_EXPRESSION');
        const params: string[] = [];
        while (this.peek().type !== 'R_EXPRESSION') {
            params.push(this.consume('IDENTIFICADOR', "Se esperaba el nombre del parámetro.").value);
            if (this.peek().type === ',') this.consume(',');
        }
        this.consume('R_EXPRESSION');

        const body = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;

        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Function
        }, this.peek('prev').location);

        const isAsync: boolean = DecoratorProcessor.matchAndDelete('asincrono', true);
        const isStatic: boolean = DecoratorProcessor.matchAndDelete('fijar', true);

        return this.createNode<FunctionNode<T, N>>({
            type: 'Funcion',
            id,
            metadata: {
                isConstructor: flags.constructor,
                isMethod: flags.method,
                isStatic,
                isAsync
            },
            params,
            body
        });
    }

    private reset () {
        this.isConstructor = false;
        this.isMethod = true;
    }
}