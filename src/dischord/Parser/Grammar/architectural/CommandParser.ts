import { CommandNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../types";
import { ODBMode, TokenType, TokenTypeUnion } from "../../../chord/types";
import { SubParser } from "../../../chord/Parser/SubParser";
import { BDOParser } from "../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../chord/Parser/Parser";

/**
 * The Commands Parser.
 * This class handles the extraction of command names, descriptions, options and executions.
 */
export default class CommandParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined = DisChordTokenType.Comando;
    
    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [ DisChordTokenType.Comando ];

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Parses a command creation block.
     * Expected structure: `crear comando <nombre> {...}`
     * @returns {CommandNode} The AST node representing the command definition.
     */
    parse (): CommandNode {
        this.consume(DisChordTokenType.Comando);
        const commandName = this.consume(TokenType.IDENTIFICADOR).value;
        const body = this.parent.get(BDOParser).setMode(ODBMode.Intelligent).parse() as DisChordODBNode;

        return this.createNode<CommandNode>({
            type: DisChordTokenType.CREAR_COMANDO,
            value: commandName,
            body
        });
    }
}