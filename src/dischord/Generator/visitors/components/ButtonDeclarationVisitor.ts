import { DisChordNode, DisChordNodeType, DisChordTokenType, ButtonDeclarationNode } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import ButtonVisitor from "./ButtonVisitor";

/**
 * Generator class responsible for generating code for button values: `boton <Nombre> { ... }`.
 *
 * Always produces a bare `new Button()...` expression — never a variable declaration. When this
 * node was reached from a top-level statement position, `DisChordStatementParser` already wrapped
 * it in a regular `VariableNode`, so the wrapping (if any) is handled by the normal
 * `VariableVisitor`, not here.
 */
export default class ButtonDeclarationVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.CREAR_BOTON;

    /**
     * Generates code for a ButtonDeclarationNode.
     * @param node The ButtonDeclarationNode representing the button value.
     * @returns The generated `new Button()...` expression.
     */
    visit (node: ButtonDeclarationNode): string {
        return this.parent.get(ButtonVisitor).visit(node.body);
    }
}
