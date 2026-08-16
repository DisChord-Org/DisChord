import { DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, ButtonDeclarationNode } from "../../../types";
import { ODBMode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { BDOParser } from "../../../../chord/Parser/Grammar/BDOParser";
import { Parser } from "../../../../chord/Parser/Parser";

/**
 * The Button Declaration Parser.
 * Parses a button value: `<Nombre> { ... }` (invoked after the caller already matched the
 * literal `boton` identifier — see `UnreservedComponentDeclarations`). Reuses `BDOParser` for the
 * body, so the property syntax is identical to the existing anonymous inline form
 * (`boton { id "..."; etiqueta "..."; estilo "..."; }`).
 *
 * Always produces a bare `ButtonDeclarationNode` — it does not decide whether the result should
 * be bound to a reusable name; that's `DisChordStatementParser`'s job, since only it knows
 * whether this was reached from a top-level statement position or nested as an expression value.
 */
export default class ButtonDeclarationParser extends SubParser<DisChordNodeType, DisChordNode> {
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
     * Parses a button value.
     * Expected structure (the literal 'boton' identifier already consumed by the caller): `<Nombre> {...}`
     * @returns {ButtonDeclarationNode} The AST node representing the button value.
     */
    parse (): ButtonDeclarationNode {
        const name = this.consume(TokenType.IDENTIFICADOR, "Se debe especificar el nombre del botón").value;
        const body = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<ButtonDeclarationNode>({
            type: DisChordTokenType.CREAR_BOTON,
            name,
            body
        });
    }
}
