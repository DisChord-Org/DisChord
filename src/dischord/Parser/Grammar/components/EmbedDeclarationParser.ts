import { DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, EmbedDeclarationNode } from "../../../types";
import { ODBMode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { BDOParser } from "../../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../../chord/Parser/Parser";

/**
 * The Embed Declaration Parser.
 * Parses an embed value: `<Nombre> { ... }` (invoked after the caller already matched the
 * literal `embed` identifier and consumed the leading `nuevo` token — see
 * `DisChordParser.parseCustomStatement`). Reuses `BDOParser` for the body, so the property
 * syntax is identical to the existing anonymous inline form (`embed { titulo "..."; }`).
 *
 * Always produces a bare `EmbedDeclarationNode` — it does not decide whether the result should
 * be bound to a reusable name; that's `DisChordStatementParser`'s job, since only it knows
 * whether this was reached from a top-level statement position or nested as an expression value.
 */
export default class EmbedDeclarationParser extends SubParser<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    static triggerToken: DisChordNodeType | undefined = undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [];

    /**
     * @param parent - The main Parser context for token expression handling
     */
    constructor (protected parent: Parser<DisChordNodeType, DisChordNode>) {
        super(parent);
    }

    /**
     * Parses an embed value.
     * Expected structure (the literal 'embed' identifier already consumed by the caller): `<Nombre> {...}`
     * @returns {EmbedDeclarationNode} The AST node representing the embed value.
     */
    parse (): EmbedDeclarationNode {
        const name = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre del embed").value;
        const body = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<EmbedDeclarationNode>({
            type: DisChordTokenType.CREAR_EMBED,
            name,
            body
        });
    }
}
