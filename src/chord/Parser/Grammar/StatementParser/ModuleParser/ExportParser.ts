import { SubParser } from "../../../SubParser";
import { BaseNode, ExportNode, TokenType, TokenTypeUnion } from "../../../../model/types";

export class ExportParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Exportar;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Exportar ];

    public parse(): ExportNode<T, N> {
        this.consume(TokenType.Exportar);
        
        const object = this.parent.parseStatement();

        return this.createNode<ExportNode<T, N>>({
            type: TokenType.Exportar,
            object
        });
    }
}