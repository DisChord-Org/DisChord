import { Test } from "../../../Test";

/**
 * @class VariableAwaitUnionTest
 * @description Validates that a method called on a union typed receiver is awaited like on an untyped one when every class of the union declaring it marks it async.
 */
export class VariableAwaitUnionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Union - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await an async method on a union of a class and a primitive";
}
