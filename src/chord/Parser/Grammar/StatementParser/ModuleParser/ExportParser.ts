import { SubParser } from "../../../subparser";
import { BaseNode, ExportNode, TokenType } from "../../../../types";
import { StatementParser } from "../StatementParser";
import { Parser } from "../../../parser";

export class ExportParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Exportar;

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ExportNode<T, N> {
        this.consume(TokenType.Exportar);
        
        const object = this.parent.get(StatementParser).parse();

        return this.createNode<ExportNode<T, N>>({
            type: TokenType.Exportar,
            object
        });
    }
}