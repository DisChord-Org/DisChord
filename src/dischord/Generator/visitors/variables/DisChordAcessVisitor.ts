import { AccessNode, IdentificatorNode, TokenTypeUnion } from "../../../../chord/types";
import { AccessVisitor } from "../../../../chord/Generator/visitors/variables/AccessVisitor";
import { DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { corelib } from "../../../core.lib"; // Tu corelib específica de DisChord

/**
 * Custom specialized accessor visitor for DisChord routing bot payloads and translations.
 * @class DisChordAccessVisitor
 * @extends {AccessVisitor<DisChordNodeType, DisChordNode>}
 */
export class DisChordAccessVisitor extends AccessVisitor<DisChordNodeType, DisChordNode> {

    /**
     * Evaluates a property accessor structure routing matches directly into DisChord polyfills,
     * falling back to native Chord translations if no bot mapping matches.
     * @override
     * @param {AccessNode<DisChordNodeType, DisChordNode>} node - The target field access syntax tree node.
     * @returns {string} The fully resolved and chained member dot-notation string.
     * @public
     */
    public override visit(node: AccessNode<DisChordNodeType, DisChordNode>): string {
        const targetObject = node.object as IdentificatorNode<DisChordNodeType>;
        
        const objName = targetObject.type === 'Identificador' // Asegúrate de que coincida con tu token de identificador en DisChord
            ? targetObject.value 
            : null;
            
        const propName = node.property;

        // 1. Intentamos resolver la lógica específica de la capa de DisChord (Seyfert / Discord)
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

        // 2. Si no es nada relacionado con bots, delegamos al comportamiento nativo de Chord (clases nativas, bucles, etc.)
        return super.visit(node);
    }
}