import { SubParser } from "../../subparser";
import { ExportNode } from "../../../types";
import { StatementParser } from "../StatementParser/StatementParser";
import { Parser } from "../../parser";

export class ExportParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'EXPORTAR';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ExportNode<T, N> {
        this.consume('EXPORTAR');
        
        const object = this.parent.get(StatementParser).parse();

        return this.createNode<ExportNode<T, N>>({
            type: 'Exportar',
            object
        });
    }
}