import { SubParser } from "../../SubParser";
import { BaseNode, DeclarationKind, FunctionNode, TokenType, TokenTypeUnion } from "../../../model/types";
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
        const flags = {
            constructor: this.isConstructor,
            method: this.isMethod
        };

        this.reset();

        // Taken before the body is parsed: the decorator box is global, so a function nested in the
        // body would otherwise consume the decorators written for this one.
        const isAsync: boolean = DecoratorProcessor.matchAndDelete('asincrono', true);
        const isStatic: boolean = DecoratorProcessor.matchAndDelete('fijar', true);

        const id = this.parseName(flags);

        return this.within(id, () => {
            this.consume(TokenType.L_PAREN, `Después del nombre de la función se debe abrir una expresión con '(' para especificar los parámetros.`);
            const typeParser = new TypeAnnotationParser(this.parent);
            const params: string[] = [];
            const paramTypes: (DataType | undefined)[] = [];
            this.parseDelimited(TokenType.R_PAREN, () => {
                params.push(this.declare(DeclarationKind.Parameter, this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre del parámetro.")));
                paramTypes.push(typeParser.parse());
            }, true);
            this.consume(TokenType.R_PAREN);

            let returnType: DataType | undefined;
            if (this.peek().type === TokenType.Flecha) {
                if (flags.constructor) throw new ChordError({
                    phase: ErrorLevel.Parser,
                    message: "Un constructor no puede declarar un tipo de retorno",
                    location: this.peek().location
                });

                this.consume(TokenType.Flecha);
                returnType = typeParser.parseType();
            }

            const body = this.parseBlockBody();

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
        });
    }

    /** Consumes and declares the name: the constructor's, or a method's or free function's after `funcion`. */
    private parseName(flags: { constructor: boolean; method: boolean }): string {
        if (flags.constructor) {
            return this.declare(DeclarationKind.Constructor, this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre del constructor."));
        }

        this.consume(TokenType.Funcion);

        // a method may be named after a reserved word (`funcion en() {}`); a free function may not.
        const nextToken = this.peek();
        const nameType = flags.method && this.isReservedMemberName(nextToken) ? nextToken.type : TokenType.IDENTIFICADOR;

        return this.declare(flags.method ? DeclarationKind.Method : DeclarationKind.Function, this.consume(nameType, "Se esperaba el nombre de la función."));
    }

    private reset () {
        this.isConstructor = false;
        this.isMethod = true;
    }
}