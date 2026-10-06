import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsUnannotatedTest
 * @description Validates that a function with no annotation at all accepts any number of arguments, as before.
 */
export class FunctionTypedArgsUnannotatedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Unannotated - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave calls to an unannotated function unchecked";
}
