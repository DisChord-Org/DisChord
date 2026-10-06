import { Test } from "../../../Test";

/**
 * @class VariableAwaitPromiseTopLevelTest
 * @description Validates that an async core library member (`Promesa.todas`) is awaited at the top level of a file.
 */
export class VariableAwaitPromiseTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Promise Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await Promesa.todas at the top level";
}
