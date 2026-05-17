import { ExitLoopNode } from "../../../../types";
import { Parser } from "../../../parser";
import { SubParser } from "../../../subparser";

export class ExitParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'SALIR';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ExitLoopNode<T> {
        this.consume('SALIR');
        return this.createNode<ExitLoopNode<T>>({
            type: 'Salir'
        });
    }
}