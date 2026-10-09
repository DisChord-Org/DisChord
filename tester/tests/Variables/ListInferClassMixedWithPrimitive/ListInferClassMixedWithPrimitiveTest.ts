import { Test } from "../../../Test";

/**
 * @class ListInferClassMixedWithPrimitiveTest
 * @description Validates that a list of a number and an instance is inferred as a list of the union of both.
 */
export class ListInferClassMixedWithPrimitiveTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Mixed With Primitive - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer a union of a primitive and a class for a mixed list";
}
