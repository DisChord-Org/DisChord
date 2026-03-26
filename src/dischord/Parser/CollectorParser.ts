import { DisChordParser } from "./parser";
import { CollectorNode, CollectorPulseBody, DisChordASTNode } from "../types";
import { KeyWords } from "../../chord/keywords";
import { SubParser } from "./subparser";

/**
 * The Collector Parser.
 * This class is responsible for parsing interaction collector definitions,
 * which include the collector variable and its pulse bodies (e.g., alPulsarId).
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
        const body: CollectorPulseBody[] = [];

        this.consume('L_BRACE');
        while (this.peek().type !== 'R_BRACE') {
            const token = this.peek();

            switch (token.value) {
                case 'alPulsarId':
                    body.push(this.parseCollectorPulseBody());
                    break;
                default:
                    throw new Error(`Dentro del recolector se esperaba 'alPulsarId', se encontró '${token.value}'`);
            }
        }
        this.consume('R_BRACE');

        return {
            type: 'CrearRecolector',
            variable,
            body
        };
    }

    /**
     * Parses the body of a collector pulse, which defines the behavior when a specific interaction occurs (e.g., button press).
     * Expected structure: `alPulsarId <id> {...}`
     * @returns The parsed collector pulse body.
     */
    private parseCollectorPulseBody(): CollectorPulseBody {
        this.consume('IDENTIFICADOR'); // alPulsarId
        const id = this.parsePrimary();
        const body: DisChordASTNode[] = [];

        this.consume('L_BRACE');
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement());
        }
        this.consume('R_BRACE');

        return {
            method: 'run',
            id,
            body
        }
    }
}