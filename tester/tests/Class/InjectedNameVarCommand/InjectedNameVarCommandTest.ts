import { Test } from "../../../Test";

/**
 * @class InjectedNameVarCommandTest
 * @description Validates that a variable named like a name the command defines is rejected.
 */
export class InjectedNameVarCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Var Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a var named like a name a command defines";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'usuario': el comando 'Prueba' ya lo define.";
}
