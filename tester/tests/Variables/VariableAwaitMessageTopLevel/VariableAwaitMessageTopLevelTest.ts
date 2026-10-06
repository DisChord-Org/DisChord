import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageTopLevelTest
 * @description Validates that `enviar mensaje` at the top level of a file compiles.
 */
export class VariableAwaitMessageTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'enviar mensaje' at the top level";
}
