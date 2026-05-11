import { ASTNode } from "../../../types";
import { Parser } from "../../parser";
import { SubParser } from "../../subparser";
import { LogicalParser } from "./LogicalParser";

export class AssignmentParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'ES';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Entry point for the SubParser.
     * Consumes the ES statement and calls the expressions subparsers.
     */
    public parse(): ASTNode<T, N> {
        return this.parent.get(LogicalParser).parse();
    }
}