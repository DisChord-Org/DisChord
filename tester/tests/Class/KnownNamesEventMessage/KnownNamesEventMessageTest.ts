import { Test } from "../../../Test";

/**
 * @class KnownNamesEventMessageTest
 * @description Validates that the parameters of a message event are known names inside its body.
 */
export class KnownNamesEventMessageTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Names Event Message - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the client in a message event";
}
