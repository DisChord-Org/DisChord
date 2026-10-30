import { Test } from "../../../Test";

/**
 * @class InjectedNameOptionCommandTest
 * @description Validates that a variable named like an option of the command is rejected.
 */
export class InjectedNameOptionCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Option Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a var named like an option";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'valor': el comando 'Prueba' ya lo define.";
}
