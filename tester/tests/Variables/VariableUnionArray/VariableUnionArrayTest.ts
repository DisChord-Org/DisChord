import { Test } from "../../../Test";

/**
 * @class VariableUnionArrayTest
 * @description Validates that a union in parentheses can be an array element type (`(texto|Lista)[]`).
 */
export class VariableUnionArrayTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Array - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept an array of a union of a primitive and a list";
}
