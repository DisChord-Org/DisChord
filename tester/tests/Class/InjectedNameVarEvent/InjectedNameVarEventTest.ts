import { Test } from "../../../Test";

/**
 * @class InjectedNameVarEventTest
 * @description Validates that a variable named like a name the event defines is rejected.
 */
export class InjectedNameVarEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Var Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a var named like a name an event defines";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'usuario': el evento 'encendido' ya lo define.";
}
