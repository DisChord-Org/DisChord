import { Test } from "../../../Test";

/**
 * @class InjectedNameLoopCommandTest
 * @description Validates that the variable of a loop inside a command is rejected when it is named like a name the command defines.
 */
export class InjectedNameLoopCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Loop Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject such a loop variable in a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'usuario': el comando 'Prueba' ya lo define.";
}
