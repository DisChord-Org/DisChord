import { Test } from "../../../Test";

/**
 * @class StartBotCustomPropertiesTest
 * @description Pins that the keys of `encender bot` the schema doesn't declare are set on the client before it starts, awaiting the ones that are not literals
 */
export class StartBotCustomPropertiesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Custom Properties - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to set the extra keys of 'encender bot' as properties of the client, awaiting an async value";
}
