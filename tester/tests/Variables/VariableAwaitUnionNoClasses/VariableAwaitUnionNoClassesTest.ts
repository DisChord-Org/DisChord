import { Test } from "../../../Test";

/**
 * @class VariableAwaitUnionNoClassesTest
 * @description Validates that a union without classes of the file is never awaited.
 */
export class VariableAwaitUnionNoClassesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Union No Classes - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not await a method on a union of primitives";
}
