import { Test } from "../../../Test";

/**
 * @class VariableAwaitCommandTest
 * @description Validates that the body of a dischord command is an async context, where an async function may be called.
 */
export class VariableAwaitCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile an async call inside a command without error";
}
