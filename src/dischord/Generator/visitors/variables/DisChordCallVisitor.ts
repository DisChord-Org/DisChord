import { CallVisitor } from "../../../../chord/Generator/visitors/variables/CallVisitor";
import { DisChordNodeType, DisChordNode } from "../../../types";
import { CallNode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import { corelib } from "../../../core.lib";

export class DisChordCallVisitor extends CallVisitor<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     * @override
     */
    public static override triggerToken: TokenTypeUnion<TokenType> | undefined = TokenType.LLAMADA;

     /**
     * Overrides the visit method to provide custom code generation for function calls based on the core library mappings.
     * @override
     * @param node The CallNode representing a function call in the AST, containing the function being called and its parameters.
     * @returns The generated code for the function call, which may be translated based on the core library mappings or fall back to the default generation if no mapping is found.
     */
    public override visit(node: CallNode<DisChordNodeType, DisChordNode>): string {
        if (node.object.type === TokenType.IDENTIFICADOR) {
            const name = node.object.value;

            if (typeof corelib[name] === 'string') {
                const translation = corelib[name] as string;
                const args = node.params.map(arg => this.parent.visit(arg)).join(', ');
                return `${translation}(${args})`;
            }
        }

        return super.visit(node);
    }
}