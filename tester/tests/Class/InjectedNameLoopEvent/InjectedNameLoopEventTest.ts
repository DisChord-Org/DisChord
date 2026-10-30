import { Test } from "../../../Test";

/**
 * @class InjectedNameLoopEventTest
 * @description Validates that the variable of a loop inside an event is rejected when it is named like a name the event defines.
 */
export class InjectedNameLoopEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Loop Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject such a loop variable in an event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'usuario': el evento 'encendido' ya lo define.";
}
