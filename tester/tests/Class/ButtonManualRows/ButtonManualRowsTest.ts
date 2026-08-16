import { Test } from "../../../Test";

/**
 * @class ButtonManualRowsTest
 * @description Validates that `boton [ [A], [B C] ]` (a list of lists) lays out buttons into
 * explicit, manually-specified ActionRows instead of the automatic 5-per-row chunking — e.g. a
 * deliberate single-button row that auto-splitting alone couldn't express.
 */
export class ButtonManualRowsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Button Manual Rows - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to lay buttons out into explicit manually-specified ActionRows when given a list of lists';
}
