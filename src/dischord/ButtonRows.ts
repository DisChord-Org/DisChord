import { DisChordASTNode } from "./types";
import { TokenType } from "../chord/model/types";

/**
 * Discord's rules for laying buttons out in `ActionRow`s, shared by the Analyzer that validates a
 * `boton` property and the visitor that generates it.
 */
export class ButtonRows {
    /** Discord's maximum number of components (buttons) allowed in a single ActionRow. */
    public static readonly MAX_PER_ROW = 5;

    /**
     * @param {{ body: DisChordASTNode[] }} list - A `boton` property's list value.
     * @returns {boolean} Whether it is a list of lists: each inner list is an explicit row, not
     * to be auto-split.
     */
    public static isManualLayout (list: { body: DisChordASTNode[] }): boolean {
        return list.body.length > 0 && list.body.every(item => item.type === TokenType.LISTA);
    }
}
