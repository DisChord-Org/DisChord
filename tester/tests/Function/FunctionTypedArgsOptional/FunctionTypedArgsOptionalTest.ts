import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsOptionalTest
 * @description Validates that a missing argument is accepted for a parameter whose type admits `indefinido` and for a parameter without a type.
 */
export class FunctionTypedArgsOptionalTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Optional - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a missing argument for an optional or untyped parameter";
}
