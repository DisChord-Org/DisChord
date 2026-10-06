import { Test } from "../../../Test";

/**
 * @class VariableClassUnionTest
 * @description Validates that a core library class can be a member of a union type (`Mapa|texto`).
 */
export class VariableClassUnionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Class Union - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a union of types that includes a core library class";
}
