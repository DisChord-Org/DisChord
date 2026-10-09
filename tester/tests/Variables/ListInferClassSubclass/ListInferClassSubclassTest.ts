import { Test } from "../../../Test";

/**
 * @class ListInferClassSubclassTest
 * @description Validates that a list mixing a subclass and its base is accepted as a list of the base.
 */
export class ListInferClassSubclassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Subclass - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a list of subclass and base instances as a list of the base";
}
