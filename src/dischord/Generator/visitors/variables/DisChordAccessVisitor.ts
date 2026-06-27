import { AccessVisitor } from "../../../../chord/Generator/visitors/variables/AccessVisitor";
import { DisChordNodeType, DisChordNode } from "../../../types";
import { AccessNode, TokenType } from "../../../../chord/types";
import { corelib } from "../../../core.lib";

export class DisChordAccessVisitor extends AccessVisitor<DisChordNodeType, DisChordNode> {
    public static override triggerToken = TokenType.ACCESO;

    public override visit(node: AccessNode<DisChordNodeType, DisChordNode>): string {
        const objName = node.object.type === TokenType.IDENTIFICADOR ? node.object.value : null;
        const propName = node.property;

        if (objName && corelib[objName]) {
            const mapping = corelib[objName];

            if (typeof mapping === 'object' && mapping[propName]) {
                const translation = mapping[propName];

                if (translation.startsWith(objName + '.')) {
                    return translation;
                }
                return `${objName}.${translation}`;
            }
        }

        return super.visit(node);
    }
}