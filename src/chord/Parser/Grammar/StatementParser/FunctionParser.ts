import { SubParser } from "../../SubParser";
import { BaseNode, FunctionNode, TokenType, TokenTypeUnion } from "../../../types";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../Parser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { DataType } from "../../../model/DataType";
import { TypeAnnotationParser } from "./TypeAnnotationParser";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";

export class FunctionParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Funcion;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Funcion ];

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

        // Taken before the body is parsed: the decorator box is global, so a function nested in the
        // body would otherwise consume the decorators written for this one.
        const isAsync: boolean = DecoratorProcessor.matchAndDelete('asincrono', true);
        const isStatic: boolean = DecoratorProcessor.matchAndDelete('fijar', true);

        if (flags.constructor) {
            id = this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre del constructor.").value;
        } else {
            this.consume(TokenType.Funcion);

            // a method may be named after a reserved word (`funcion en() {}`); a free function may not.
            const nextToken = this.peek();
            const nameType = flags.method && this.isReservedMemberName(nextToken) ? nextToken.type : TokenType.IDENTIFICADOR;
            id = this.consume(nameType, "Se esperaba el nombre de la función.").value;
        }

        this.consume(TokenType.L_PAREN, `Después del nombre de la función se debe abrir una expresión con '(' para especificar los parámetros.`);
        const typeParser = new TypeAnnotationParser(this.parent);
        const params: string[] = [];
        const paramTypes: (DataType | undefined)[] = [];
        while (!this.isAtEnd() && this.peek().type !== TokenType.R_PAREN) {
            params.push(this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre del parámetro.").value);
            paramTypes.push(typeParser.parse());
            if (this.peek().type === TokenType.COMA) this.consume(TokenType.COMA);
        }
        this.consume(TokenType.R_PAREN);

        let returnType: DataType | undefined;
        if (this.peek().type === TokenType.Flecha) {
            if (flags.constructor) throw new ChordError({
                phase: ErrorLevel.Parser,
                message: "Un constructor no puede declarar un tipo de retorno",
                location: this.peek().location
            }).format();

            this.consume(TokenType.Flecha);
            returnType = typeParser.parseType();
        }

        const body = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;

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
            ...(paramTypes.some(type => type !== undefined) && { paramTypes }),
            ...(returnType && { returnType }),
            body
        });
    }

    private reset () {
        this.isConstructor = false;
        this.isMethod = true;
    }
}