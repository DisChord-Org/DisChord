import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageCommandTest
 * @description Validates that `enviar mensaje` directly inside a command compiles.
 */
export class VariableAwaitMessageCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'enviar mensaje' inside a command";
}
