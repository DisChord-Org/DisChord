import { Test } from "../../../Test";

/**
 * @class InjectedNameOutsideFunctionTest
 * @description Validates that a function declared outside the event can have a parameter named like a name the event defines.
 */
export class InjectedNameOutsideFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Outside Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept such a parameter in a function outside the event";
}
