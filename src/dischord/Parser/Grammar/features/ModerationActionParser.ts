import { ModerationAction, ModerationActionNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { ODBMode, TokenType, TokenTypeUnion } from "../../../../chord/model/types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { BDOParser } from "../../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../../chord/Parser/Parser";

/**
 * The Moderation Action Parser.
 * Parses `banear miembro { ... }`, `desbanear usuario { ... }` and `expulsar miembro { ... }` into a single
 * `ModerationActionNode`, whose `action` tells the three apart.
 *
 * None of the words is reserved: `banear`, `desbanear`, `expulsar`, `miembro` and `usuario` keep working as
 * ordinary identifiers (the `usuario` of a command...). The block is
 * recognized by its shape alone — `<verbo> <objeto> {` — through the `UnreservedActions` table
 * `DisChordParser.parseCustomStatement` dispatches from, so it needs no `triggerToken` nor
 * registered keywords.
 */
export default class ModerationActionParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** Recognized by shape, not by a reserved token. */
    static triggerToken: DisChordNodeType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers (none: see the class).
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [];

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Parses a moderation action block.
     * Expected structure: `<banear|desbanear|expulsar> <miembro|usuario> {...}`
     * @returns {ModerationActionNode} The AST node representing the moderation action.
     */
    parse (): ModerationActionNode {
        const verb = this.consume(TokenType.IDENTIFICADOR);
        this.consume(TokenType.IDENTIFICADOR);

        const object = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<ModerationActionNode>({
            type: DisChordTokenType.ACCION_MODERACION,
            action: verb.value as ModerationAction,
            object
        });
    }
}
