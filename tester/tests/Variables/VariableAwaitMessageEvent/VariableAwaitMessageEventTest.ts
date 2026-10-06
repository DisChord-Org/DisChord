import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageEventTest
 * @description Validates that `enviar mensaje` directly inside an event compiles.
 */
export class VariableAwaitMessageEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'enviar mensaje' inside an event";
}
