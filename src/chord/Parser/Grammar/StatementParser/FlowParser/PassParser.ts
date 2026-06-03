import { BaseNode, PassLoopNode, TokenType, TokenTypeUnion } from "../../../../types";
import { Parser } from "../../../Parser";
import { SubParser } from "../../../subparser";

export class PassParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Pasar;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Pasar ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): PassLoopNode<T> {
        this.consume(TokenType.Pasar);
        return this.createNode<PassLoopNode<T>>({
            type: TokenType.Pasar
        });
    }
}