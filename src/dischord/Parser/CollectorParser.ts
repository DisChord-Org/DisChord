import { ASTNode } from "../../chord/types";
import { DisChordParser } from "./parser";
import { CollectorNode, CollectorPulseBody } from "../types";
import { KeyWords } from "../../chord/keywords";

/**
 * The Collector Parser.
 * This class is responsible for parsing interaction collector definitions,
 * which include the collector variable and its pulse bodies (e.g., alPulsarId).
 */
export default class CollectorParser {
    /**
     * @param ctx - The main DisChordParser context for token expression handling
     */
    constructor (private ctx: DisChordParser) {}

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
        this.ctx.consume('RECOLECTOR');

        const variable = this.ctx.parsePrimary();
        const body: CollectorPulseBody[] = [];

        this.ctx.consume('L_BRACE');
        while (this.ctx.peek().type !== 'R_BRACE') {
            const token = this.ctx.peek();

            switch (token.value) {
                case 'alPulsarId':
                    body.push(this.parseCollectorPulseBody());
                    break;
                default:
                    throw new Error(`Dentro del recolector se esperaba 'alPulsarId', se encontró '${token.value}'`);
            }
        }
        this.ctx.consume('R_BRACE');

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
        this.ctx.consume('IDENTIFICADOR'); // alPulsarId
        const id = this.ctx.parsePrimary();
        const body: ASTNode[] = [];

        this.ctx.consume('L_BRACE');
        while (this.ctx.peek().type !== 'R_BRACE') {
            body.push(this.ctx.parseStatement());
        }
        this.ctx.consume('R_BRACE');

        return {
            method: 'run',
            id,
            body
        }
    }
}