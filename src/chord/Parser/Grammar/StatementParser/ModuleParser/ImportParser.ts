import { SubParser } from "../../../subparser";
import { BaseNode, ImportNode, TokenType, TokenTypeUnion } from "../../../../types";
import { Parser } from "../../../parser";

export class ImportParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Importar;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Importar, TokenType.Desde ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ImportNode<T> {
        this.consume(TokenType.Importar);
        
        const identificators: string[] = [];
        const isDestructured = this.match(TokenType.L_BRACE);

        if (isDestructured) {
            while (!this.match(TokenType.R_BRACE) && !this.isAtEnd()) {
                identificators.push(this.consume(TokenType.IDENTIFICADOR, "Se esperaba un nombre para importar").value);
                this.match(TokenType.COMA);
            }
            this.consume(TokenType.R_BRACE);
        } else {
            identificators.push(this.consume(TokenType.IDENTIFICADOR, "Se esperaba un nombre tras 'importar'").value);
        }

        this.consume(TokenType.Desde, "Falta la palabra clave 'desde'");
        const path = this.consume(TokenType.TEXTO, "Se requiere la ruta del módulo").value;

        return this.createNode<ImportNode<T>>({
            type: TokenType.Importar,
            identificators,
            path,
            isDestructured
        });
    }
}