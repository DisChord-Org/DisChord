import { Test } from "../../../Test";

/**
 * @class InjectedNameNotDefinedTest
 * @description Validates that a variable with a name the event does not define compiles.
 */
export class InjectedNameNotDefinedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Not Defined - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a var that no name of the event defines";
}
