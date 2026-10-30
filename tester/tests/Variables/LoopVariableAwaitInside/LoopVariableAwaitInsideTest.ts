import { Test } from "../../../Test";

/**
 * @class LoopVariableAwaitInsideTest
 * @description Validates that a loop is not a function: an async call inside a loop of an async function is awaited, with no false error about the caller.
 */
export class LoopVariableAwaitInsideTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Await Inside - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await an async call made inside a loop of an async function";
}
