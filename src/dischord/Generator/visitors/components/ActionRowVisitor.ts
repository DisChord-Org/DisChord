import { DisChordError, ErrorLevel } from "../../../../errors/ChordError";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { ListNode, TokenType, TokenTypeUnion } from "../../../../chord/types";
import ButtonVisitor from "./ButtonVisitor";

/**
 * Generator class responsible for grouping button expressions into `new ActionRow()...` calls —
 * the one place that knows Discord's 5-components-per-row limit, instead of that limit (or the
 * lack of it) being baked into whatever emits buttons.
 */
export default class ActionRowVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = undefined;

    /**
     * Discord's maximum number of components (buttons) allowed in a single ActionRow.
     * @private
     * @static
     * @readonly
     */
    private static readonly MAX_PER_ROW = 5;

    /**
     * Builds one or more `new ActionRow().setComponents([...])` calls from a 'boton' property's
     * value, which can be:
     * - a single button (a BDO or a reference) — one row, one button;
     * - a flat list of buttons (`boton [ A B C ]`) — automatically split into rows of up to
     *   {@link MAX_PER_ROW}, in order;
     * - a list of lists (`boton [ [A] [B C] ]`) — each inner list is taken as an explicit,
     *   manually-laid-out row instead of being auto-chunked, for layouts auto-splitting can't
     *   express (e.g. a deliberate single-button row).
     * @param button The parsed value of the message's 'boton' property.
     * @throws {DisChordError} If an explicit manual row exceeds {@link MAX_PER_ROW} buttons.
     * @returns The comma-separated `new ActionRow()...` calls, ready to sit inside `components: [ ... ]`.
     */
    visit (button: DisChordASTNode): string {
        if (button.type !== TokenType.LISTA) {
            return this.buildRow([ button ]);
        }

        const list = button as unknown as ListNode<DisChordNodeType, DisChordNode>;

        const isManualLayout = list.body.length > 0 && list.body.every(item => item.type === TokenType.LISTA);

        if (isManualLayout) {
            return list.body
                .map(row => this.buildRow((row as unknown as ListNode<DisChordNodeType, DisChordNode>).body))
                .join(', ');
        }

        return this.buildAutoRows(list.body);
    }

    /**
     * Splits a flat list of buttons into consecutive rows of up to {@link MAX_PER_ROW}.
     * @private
     */
    private buildAutoRows (buttons: DisChordASTNode[]): string {
        const rows: DisChordASTNode[][] = [];

        for (let i = 0; i < buttons.length; i += ActionRowVisitor.MAX_PER_ROW) {
            rows.push(buttons.slice(i, i + ActionRowVisitor.MAX_PER_ROW));
        }

        return rows.map(row => this.buildRow(row)).join(', ');
    }

    /**
     * Builds a single `new ActionRow().setComponents([...])` call from its buttons.
     * @private
     * @throws {DisChordError} If `buttons` exceeds {@link MAX_PER_ROW}.
     */
    private buildRow (buttons: DisChordASTNode[]): string {
        if (buttons.length > ActionRowVisitor.MAX_PER_ROW) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Una fila de botones admite como máximo ${ActionRowVisitor.MAX_PER_ROW}, se han especificado ${buttons.length}.`,
            location: buttons[0].location
        }).format();

        const buttonsCode = buttons.map(button => this.resolveButtonExpression(button)).join(', ');

        return `new ActionRow().setComponents([ ${buttonsCode} ])`;
    }

    /**
     * Resolves a single button-producing expression: an anonymous inline BDO gets wrapped via
     * `ButtonVisitor.visit()`, anything else (a reference to an already-declared button) is
     * passed through as-is.
     * @private
     */
    private resolveButtonExpression (button: DisChordASTNode): string {
        return button.type === TokenType.BDO
            ? this.parent.get(ButtonVisitor).visit(button)
            : this.parent.visit(button);
    }
}
