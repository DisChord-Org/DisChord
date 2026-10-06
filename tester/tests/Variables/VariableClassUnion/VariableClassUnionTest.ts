import { Test } from "../../../Test";

/**
 * @class VariableClassUnionTest
 * @description Validates that a core library class can't be a member of a union type, since a union only holds primitives.
 */
export class VariableClassUnionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Class Union - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a union of types that includes a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no puede formar parte de una unión de tipos";
}
