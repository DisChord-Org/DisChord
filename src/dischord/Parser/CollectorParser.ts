import { DisChordParser } from "./parser";
import { CollectorNode } from "../types";
import { KeyWords } from "../../chord/keywords";
import { SubParser } from "./subparser";
import { ODBMode } from "../../chord/types";

/**
 * The Collector Parser.
 * This class is responsible for parsing interaction collector definitions,
 * which include the collector variable and its pulse bodies.
 */
export default class CollectorParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "recolector";
    /**
     * @param parent - The main DisChordParser context for token expression handling
     */
    constructor (protected parent: DisChordParser) {
        super(parent);
    }

    /**
     * Injects DisChord-specific keywords into the global system 
     * so the Lexer can correctly identify them as tokens.
     * This method is called by DisChordParser.
     */
    public static injectStatements () {
        KeyWords.addStatements([ "recolector" ]);
    }

    /**
     * Parses a collector creation block.
     * Expected structure: `crear recolector <variable> {...}`
     * @returns The parsed collector node.
     */
    parse (): CollectorNode {
        this.consume('RECOLECTOR');

        const variable = this.parsePrimary();
        const methods = this.parseODB(ODBMode.Simple);

        return this.createNode<CollectorNode>({
            type: 'CrearRecolector',
            variable,
            methods
        });
    }
}