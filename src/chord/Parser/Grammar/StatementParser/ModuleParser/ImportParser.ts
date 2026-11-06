import { SubParser } from "../../../SubParser";
import { BaseNode, DeclarationKind, ImportNode, TokenType, TokenTypeUnion } from "../../../../model/types";

/*
importar { foo, bar } desde "./module.chord"
importar foo desde "./module.chord"
importar "./module.chord" // solo efectos secundarios

importar { ent } desde "lib:ent" // importar desde la carpeta lib
importar ent // atajo de: importar ent desde "lib:ent"
*/

export class ImportParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Importar;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Importar, TokenType.Desde ];

    public parse(): ImportNode<T> {
        this.consume(TokenType.Importar);

        const identificators: string[] = [];
        const isDestructured = this.match(TokenType.L_BRACE);

        if (isDestructured) {
            this.parseDelimited(TokenType.R_BRACE, () => {
                identificators.push(this.declare(DeclarationKind.Import, this.consume(TokenType.IDENTIFICADOR, "Se esperaba un nombre para importar")));
            }, true);
            this.consume(TokenType.R_BRACE);
        } else {
            identificators.push(this.declare(DeclarationKind.Import, this.consume(TokenType.IDENTIFICADOR, "Se esperaba un nombre tras 'importar'")));
        }

        let path: string;

        if (!isDestructured && this.peek().type !== TokenType.Desde) {
            path = `lib:${identificators[0]}`;
        } else {
            this.consume(TokenType.Desde, "Falta la palabra clave 'desde'");
            path = this.consume(TokenType.TEXTO, "Se requiere la ruta del módulo").value;
        }

        return this.createNode<ImportNode<T>>({
            type: TokenType.Importar,
            identificators,
            path,
            isDestructured
        });
    }
}