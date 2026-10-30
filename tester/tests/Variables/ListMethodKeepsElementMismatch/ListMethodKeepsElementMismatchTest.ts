import { Test } from "../../../Test";

/**
 * @class ListMethodKeepsElementMismatchTest
 * @description It has to reject a filtered list of numbers assigned to a list of texts
 */
export class ListMethodKeepsElementMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'List Method Keeps Element Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a filtered list of numbers assigned to a list of texts";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "texto[]";
}
