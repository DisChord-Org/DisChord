import { BaseNode, ExitLoopNode, TokenType, TokenTypeUnion } from "../../../../model/types";
import { SubParser } from "../../../SubParser";

export class ExitParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Salir;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Salir ];

    public parse(): ExitLoopNode<T> {
        this.consume(TokenType.Salir);
        return this.createNode<ExitLoopNode<T>>({
            type: TokenType.Salir
        });
    }
}