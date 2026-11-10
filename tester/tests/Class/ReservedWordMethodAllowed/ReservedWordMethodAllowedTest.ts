import { Test } from "../../../Test";

/**
 * @class ReservedWordMethodAllowedTest
 * @description Validates that a method of a class may carry a reserved word of JavaScript as its name, since that is valid JavaScript.
 */
export class ReservedWordMethodAllowedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Method Allowed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to accept a method named class';
}
