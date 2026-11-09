import { Test } from "../../../Test";

/**
 * @class StartBotReservedPropertyTest
 * @description Validates that a custom property of `encender bot` can't take the name of something `cliente` already has
 */
export class StartBotReservedPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Reserved Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when a custom property of 'encender bot' is a name 'cliente' already has";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'cache' ya existe en 'cliente'";
}
