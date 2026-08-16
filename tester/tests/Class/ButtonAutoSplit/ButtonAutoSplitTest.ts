import { Test } from "../../../Test";

/**
 * @class ButtonAutoSplitTest
 * @description Validates that a flat list of more than 5 buttons is automatically split across
 * multiple `ActionRow`s, respecting Discord's 5-components-per-row limit.
 */
export class ButtonAutoSplitTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Button Auto Split - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to automatically split more than 5 buttons across multiple ActionRows';
}
