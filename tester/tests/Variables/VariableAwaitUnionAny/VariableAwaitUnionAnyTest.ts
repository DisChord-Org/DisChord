import { Test } from "../../../Test";

/**
 * @class VariableAwaitUnionAnyTest
 * @description Validates that a receiver typed `cualquiera` behaves as an untyped one.
 */
export class VariableAwaitUnionAnyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Union Any - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to treat a cualquiera receiver like an unknown one";
}
