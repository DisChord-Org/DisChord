import { Test } from "../../../Test";

/**
 * @class VariableAwaitUnionTwoClassesTest
 * @description Validates that a union where a class declares the method as sync is not awaited.
 */
export class VariableAwaitUnionTwoClassesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Union Two Classes - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not await when a class of the union declares the method as sync";
}
