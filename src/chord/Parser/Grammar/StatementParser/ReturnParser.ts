import { SubParser } from "../../subparser";
import { ReturnNode } from "../../../types";
import { Parser } from "../../parser";

export class ReturnParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'DEVOLVER';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }
    
    public parse(): ReturnNode<T, N> {
        this.consume('DEVOLVER');
        
        let value = undefined;
        const next = this.peek();

        const isEndOfStatement = ['R_BRACE', 'SINO', 'ADEMAS', 'EOF'].includes(next.type);

        if (!isEndOfStatement) {
            value = this.parent.parseExpression();
        }

        return this.createNode<ReturnNode<T, N>>({
            type: 'Devolver',
            object: value
        });
    }
}