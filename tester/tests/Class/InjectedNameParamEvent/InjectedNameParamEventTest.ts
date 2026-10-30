import { Test } from "../../../Test";

/**
 * @class InjectedNameParamEventTest
 * @description Validates that a parameter of a function declared inside an event is rejected when it is named like a name the event defines.
 */
export class InjectedNameParamEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Param Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject such a parameter in an event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'usuario': el evento 'encendido' ya lo define.";
}
