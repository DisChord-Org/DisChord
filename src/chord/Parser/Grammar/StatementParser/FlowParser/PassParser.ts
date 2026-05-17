import { PassLoopNode } from "../../../../types";
import { Parser } from "../../../parser";
import { SubParser } from "../../../subparser";

export class PassParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'PASAR';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): PassLoopNode<T> {
        this.consume('PASAR');
        return this.createNode<PassLoopNode<T>>({
            type: 'Pasar'
        });
    }
}