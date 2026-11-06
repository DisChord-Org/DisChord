import { BaseNode, PassLoopNode, TokenType, TokenTypeUnion } from "../../../../model/types";
import { SubParser } from "../../../SubParser";

export class PassParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Pasar;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Pasar ];

    public parse(): PassLoopNode<T> {
        this.consume(TokenType.Pasar);
        return this.createNode<PassLoopNode<T>>({
            type: TokenType.Pasar
        });
    }
}