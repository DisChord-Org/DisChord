import { BaseNode, ExitLoopNode, TokenType } from "../../../../types";
import { Parser } from "../../../parser";
import { SubParser } from "../../../subparser";

export class ExitParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Salir;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ExitLoopNode<T> {
        this.consume(TokenType.Salir);
        return this.createNode<ExitLoopNode<T>>({
            type: TokenType.Salir
        });
    }
}