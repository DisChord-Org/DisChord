import { Test } from "../../../Test";

/**
 * @class InjectedNameParamCommandTest
 * @description Validates that a parameter of a function declared inside a command is rejected when it is named like a name the command defines.
 */
export class InjectedNameParamCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Param Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject such a parameter in a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'usuario': el comando 'Prueba' ya lo define.";
}
