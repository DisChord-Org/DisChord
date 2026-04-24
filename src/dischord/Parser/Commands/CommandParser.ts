import { DisChordParser } from "../parser";
import { CommandNode } from "../../types";
import { KeyWords } from "../../../chord/keywords";
import { SubParser } from "../subparser";
import { ODBMode } from "../../../chord/types";

/**
 * The Commands Parser.
 * This class handles the extraction of command names, descriptions, options and executions.
 */
export default class CommandParser extends SubParser {
    /** To identify when this parser should be used */
    static triggerToken: string = "comando";

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
        KeyWords.addStatements([ "comando" ]);
    }

    /**
     * Parses a command creation block.
     * Expected structure: `crear comando <nombre> {...}`
     * @returns {CommandNode} The AST node representing the command definition.
     */
    parse (): CommandNode {
        this.consume('COMANDO');
        const commandName = this.consume('IDENTIFICADOR').value;
        const body = this.parseODB(ODBMode.Intelligent);

        return this.createNode<CommandNode>({
            type: 'CrearComando',
            value: commandName,
            body
        });
    }
}