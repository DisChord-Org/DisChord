import { walkAST } from "../../chord/walkAST";
import { literalStringValue } from "../../chord/BDOSchema";
import { isIdentificatorNode, isVariableNode } from "../../chord/ast.guards";
import { BinaryExpressionNode, ExpressionNode, IdentificatorNode, ListNode, LiteralNode, TokenType } from "../../chord/model/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, MessageNode } from "../types";

/**
 * A button id whose value is only known when the program runs, with the text it was written as.
 */
export interface DynamicButtonId {
    readonly node: DisChordASTNode;
    /** The id as it was in the source: the literal parts as they are and the names between braces (`b{n}`). */
    readonly text: string;
}

/**
 * The ids of the buttons of a message: the fixed ones, written as a plain text, and the dynamic ones,
 * anything else (a text with braces, an identifier, an expression).
 */
export interface MessageButtonIds {
    readonly fixed: string[];
    readonly dynamic: DynamicButtonId[];
}

/**
 * Knows the buttons of a file, to tell which ids a message gives its buttons: the inline ones
 * (`boton { id "a" ... }`), a list of them (flat or in manual rows) and the references to a button
 * declared on its own (`nuevo boton Aceptar { id "a" ... }`, used as `boton Aceptar`).
 *
 * Only answers when it can see every button of the message; a button it can't resolve (a reference to
 * something that isn't a declared button, a button without an `id`) makes the answer unknown, since
 * the id it is looking for might be there.
 */
export class ButtonIdIndex {
    private readonly declared: Map<string, DisChordODBNode> = new Map();

    /**
     * @param {DisChordASTNode[]} nodes - The top-level nodes of the file, searched for button declarations.
     */
    constructor (nodes: DisChordASTNode[]) {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (isVariableNode(current) && current.value.type === DisChordTokenType.CREAR_BOTON) {
                this.declared.set(current.id, current.value.body);
            }
        }));
    }

    /**
     * @param {MessageNode} message - A message being created.
     * @returns {DisChordODBNode[] | undefined} The BDO of each of its buttons (none if it has no `boton`), or `undefined` if some button can't be resolved.
     */
    public buttonsOf (message: MessageNode): DisChordODBNode[] | undefined {
        const buttons = message.object.blocks['boton'];

        return buttons ? this.resolve(buttons) : [];
    }

    /**
     * @param {MessageNode} message - A message being created.
     * @returns {MessageButtonIds | undefined} The ids of all its buttons, or `undefined` if some button can't be resolved.
     */
    public idsOf (message: MessageNode): MessageButtonIds | undefined {
        const buttons = this.buttonsOf(message);
        if (!buttons) return undefined;

        const ids: MessageButtonIds = { fixed: [], dynamic: [] };

        for (const button of buttons) {
            const id = button.blocks['id'];
            if (!id) return undefined;

            const fixed = literalStringValue(id);

            if (fixed !== undefined) ids.fixed.push(fixed);
            else if (id.type === TokenType.LITERAL) return undefined;
            else ids.dynamic.push({ node: id, text: this.describe(id) });
        }

        return ids;
    }

    /**
     * A dynamic id as it was written in the source: the literal parts as they are and the names between
     * braces (`b{n}`).
     * @private
     */
    private describe (id: DisChordASTNode): string {
        switch (id.type) {
            case TokenType.LITERAL: return String((id as LiteralNode<DisChordNodeType>).value);
            case TokenType.IDENTIFICADOR: return `{${(id as IdentificatorNode<DisChordNodeType>).value}}`;
            case TokenType.EXPRESION: return this.describe((id as ExpressionNode<DisChordNodeType, DisChordNode>).object);
            case TokenType.EXPRESION_BINARIA: {
                const binary = id as BinaryExpressionNode<DisChordNodeType, DisChordNode>;
                return this.describe(binary.left) + this.describe(binary.right);
            }
            default: return '{…}';
        }
    }

    /**
     * @returns The button BDOs a `boton` value stands for, or `undefined` if one can't be resolved.
     * @private
     */
    private resolve (value: DisChordASTNode): DisChordODBNode[] | undefined {
        if (value.type === TokenType.BDO) return [ value ];

        if (isIdentificatorNode(value)) {
            const body = this.declared.get(value.value);
            return body ? [ body ] : undefined;
        }

        if (value.type !== TokenType.LISTA) return undefined;

        const found: DisChordODBNode[] = [];

        for (const item of (value as ListNode<DisChordNodeType, DisChordNode>).body) {
            const inner = this.resolve(item);
            if (!inner) return undefined;

            found.push(...inner);
        }

        return found;
    }
}
