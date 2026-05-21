import { SubParser } from "../../subparser";
import { BaseNode, FunctionNode, SymbolKind, TokenType } from "../../../types";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../parser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";

export class FunctionParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Funcion;

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
            id = this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre del constructor.").value;
        } else {
            this.consume(TokenType.Funcion);
            id = this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre de la función.").value;
        }

        this.consume(TokenType.L_PAREN, `Después del nombre de la función se debe abrir una expresión con '(' para especificar los parámetros.`);
        const params: string[] = [];
        while (!this.isAtEnd() && this.peek().type !== TokenType.R_PAREN) {
            params.push(this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre del parámetro.").value);
            if (this.peek().type === TokenType.COMA) this.consume(TokenType.COMA);
        }
        this.consume(TokenType.R_PAREN);

        const body = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;

        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Function
        }, this.peek('prev').location);

        const isAsync: boolean = DecoratorProcessor.matchAndDelete('asincrono', true);
        const isStatic: boolean = DecoratorProcessor.matchAndDelete('fijar', true);

        return this.createNode<FunctionNode<T, N>>({
            type: TokenType.Funcion,
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