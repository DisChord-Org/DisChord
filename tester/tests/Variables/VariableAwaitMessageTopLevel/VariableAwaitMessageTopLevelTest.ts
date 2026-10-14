import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageTopLevelTest
 * @description Validates that `enviar mensaje` at the top level of a file is rejected: the call needs the `ctx` of a command or an event.
 */
export class VariableAwaitMessageTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject 'enviar mensaje' at the top level";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "solo puede usarse dentro de un comando o un evento";
}
