import { Test } from "../../../Test";

/**
 * @class KnownNamesEventChannelTest
 * @description Validates that the parameters of a channel event are known names inside its body.
 */
export class KnownNamesEventChannelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Names Event Channel - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the parameters of a channel event";
}
