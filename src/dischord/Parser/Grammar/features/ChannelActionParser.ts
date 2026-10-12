import { ChannelAction, ChannelActionNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { ODBMode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { BDOParser } from "../../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../../chord/Parser/Parser";

/**
 * The Channel Action Parser.
 * Parses `crear canal { ... }`, `editar canal { ... }` and `borrar canal { ... }` into a single
 * `ChannelActionNode`, whose `action` tells the three apart.
 *
 * None of the three words is reserved: `crear`, `editar`, `borrar` and `canal` keep working as
 * ordinary identifiers (a method called `borrar`, the `canal` of a command...). The block is
 * recognized by its shape alone — `<verbo> canal {` — which `DisChordParser.parseCustomStatement`
 * checks through {@link ChannelActionParser.matches} before any other dispatch, so it needs no
 * `triggerToken` nor registered keywords.
 */
export default class ChannelActionParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** Recognized by shape, not by a reserved token. */
    static triggerToken: DisChordNodeType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers (none: see the class).
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [];

    /** The literal word that follows the verb. */
    private static readonly target = 'canal';

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Whether the upcoming tokens are `<verbo> canal {`, without consuming any.
     * @param parser - The parser to look ahead on.
     * @returns {boolean} `true` when a channel action block starts here.
     */
    public static matches (parser: Parser<DisChordNodeType, DisChordNode>): boolean {
        const verb = parser.peek();
        const target = parser.peek('next');

        return verb.type === TokenType.IDENTIFICADOR
            && Object.values<string>(ChannelAction).includes(verb.value)
            && target.type === TokenType.IDENTIFICADOR
            && target.value === ChannelActionParser.target
            && parser.peek(parser.cursor + 2)?.type === TokenType.L_BRACE;
    }

    /**
     * Parses a channel action block.
     * Expected structure: `<crear|editar|borrar> canal {...}`
     * @returns {ChannelActionNode} The AST node representing the channel action.
     */
    parse (): ChannelActionNode {
        const verb = this.consume(TokenType.IDENTIFICADOR);
        this.consume(TokenType.IDENTIFICADOR);

        const object = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<ChannelActionNode>({
            type: DisChordTokenType.ACCION_CANAL,
            action: verb.value as ChannelAction,
            object
        });
    }
}
