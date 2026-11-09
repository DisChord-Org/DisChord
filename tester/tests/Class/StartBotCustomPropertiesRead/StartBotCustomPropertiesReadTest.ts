import { Test } from "../../../Test";

/**
 * @class StartBotCustomPropertiesReadTest
 * @description Pins that a custom property of `encender bot` is read and reassigned through `cliente` in a command
 */
export class StartBotCustomPropertiesReadTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Custom Properties Read - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read and reassign a custom property of 'encender bot' as cliente.<key> in a command";
}
