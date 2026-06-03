import { SubParser } from "../../../subparser";
import { BaseNode, ExportNode, TokenType, TokenTypeUnion } from "../../../../types";
import { StatementParser } from "../StatementParser";
import { Parser } from "../../../Parser";

export class ExportParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Exportar;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Exportar ];

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