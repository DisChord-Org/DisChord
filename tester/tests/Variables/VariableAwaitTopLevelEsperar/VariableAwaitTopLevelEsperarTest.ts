import { Test } from "../../../Test";

/**
 * @class VariableAwaitTopLevelEsperarTest
 * @description Validates that the `esperar` helper may be awaited at the top level and inside an async function.
 */
export class VariableAwaitTopLevelEsperarTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Top Level Esperar - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await esperar at the top level and inside an async function";
}
