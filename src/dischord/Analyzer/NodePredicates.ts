import { LiteralNode, ODBNode, TokenType } from "../../chord/model/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../types";

/**
 * Questions the DisChord rules ask about a node of the tree.
 */
export class NodePredicates {
    /**
     * @param {DisChordASTNode} node - Any node of the tree.
     * @returns {boolean} Whether it is a command or an event: the two constructs whose body is a
     * scope of its own, with the names `InjectedNames` lists in it.
     */
    public static isScopeOwner (node: DisChordASTNode): boolean {
        return node.type === DisChordTokenType.CREAR_COMANDO || node.type === DisChordTokenType.EVENTO;
    }

    /**
     * @param {DisChordASTNode} node - Any node of the tree.
     * @param {string} optionType - A type of command option (`canal`, `usuario`).
     * @returns {boolean} Whether the node is a block with a `tipo` property that is that literal: the
     * declaration of a command option of that type.
     */
    public static declaresOptionType (node: DisChordASTNode, optionType: string): boolean {
        if (node.type !== TokenType.BDO) return false;

        const tipo = (node as unknown as ODBNode<DisChordNodeType, DisChordNode>).blocks['tipo'];

        return tipo?.type === TokenType.LITERAL && (tipo as LiteralNode<DisChordNodeType>).value === optionType;
    }
}
