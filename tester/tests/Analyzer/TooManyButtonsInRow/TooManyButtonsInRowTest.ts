import { Test } from "../../../Test";

/**
 * @class TooManyButtonsInRowTest
 * @description Validates that an explicit, manually-specified ActionRow (`boton [ [...] ]`) with
 * more than 5 buttons is rejected, since `ActionRowVisitor`'s manual-layout path doesn't
 * auto-split — that's precisely the point of choosing it over the automatic one.
 */
export class TooManyButtonsInRowTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Too Many Buttons In Row - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when a manually-specified ActionRow has more than 5 buttons";

    /**
     * @type {string}
     */
    public readonly expectedError: string = 'admite como máximo 5';
}
