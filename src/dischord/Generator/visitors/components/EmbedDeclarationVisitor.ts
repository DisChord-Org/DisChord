import { DisChordNode, DisChordNodeType, DisChordTokenType, EmbedDeclarationNode } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import EmbedVisitor from "./EmbedVisitor";

/**
 * Generator class responsible for generating code for embed values: `embed <Nombre> { ... }`.
 *
 * Always produces a bare `new Embed()...` expression — never a variable declaration. When this
 * node was reached from a top-level statement position, `DisChordStatementParser` already wrapped
 * it in a regular `VariableNode`, so the wrapping (if any) is handled by the normal
 * `VariableVisitor`, not here. When reached nested as an expression value (e.g. a message's
 * `embed` property), this visitor's plain expression output is exactly what's needed.
 */
export default class EmbedDeclarationVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.CREAR_EMBED;

    /**
     * Generates code for an EmbedDeclarationNode.
     * @param node The EmbedDeclarationNode representing the embed value.
     * @returns The generated `new Embed()...` expression.
     */
    visit (node: EmbedDeclarationNode): string {
        const chain = this.parent.get(EmbedVisitor).buildChain(node.body);

        return `new Embed()${chain}`;
    }
}
