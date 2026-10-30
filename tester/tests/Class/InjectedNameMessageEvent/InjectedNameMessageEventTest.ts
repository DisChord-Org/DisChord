import { Test } from "../../../Test";

/**
 * @class InjectedNameMessageEventTest
 * @description Validates that a variable named `mensaje` in a `mensajeCreado` event is rejected, since the event defines it.
 */
export class InjectedNameMessageEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Message Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject var mensaje in a message event";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'mensaje': el evento 'mensajeCreado' ya lo define.";
}
