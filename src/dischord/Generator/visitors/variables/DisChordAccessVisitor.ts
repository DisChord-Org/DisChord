import { AccessVisitor } from "../../../../chord/Generator/visitors/variables/AccessVisitor";
import { DisChordNodeType, DisChordNode } from "../../../types";
import { AccessNode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import { disChordCoreLibUtils } from "../../../corelib";

export class DisChordAccessVisitor extends AccessVisitor<DisChordNodeType, DisChordNode> {
     /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     * @override
     */
    public static override triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.ACCESO;

     /**
     * Overrides the visit method to provide custom code generation for property access based on the core library mappings.
     * @override
     * @param node The AccessNode representing a property access in the AST, containing the object and property being accessed.
     * @returns The generated code for the property access, which may be translated based on the core library mappings or fall back to the default generation if no mapping is found.
     */
    public override visit(node: AccessNode<DisChordNodeType, DisChordNode>): string {
        const member = disChordCoreLibUtils.resolveStatic(node);
        if (member) return member.member.transpile;

        return super.visit(node);
    }
}
