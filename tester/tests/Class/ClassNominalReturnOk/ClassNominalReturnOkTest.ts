import { Test } from "../../../Test";

/**
 * @class ClassNominalReturnOkTest
 * @description Validates that a function declared to return a base may return a subclass.
 */
export class ClassNominalReturnOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassNominal Return Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept returning a subclass as its base";
}
