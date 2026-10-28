import { Test } from "../../../Test";

/**
 * @class KnownNamesEventBanTest
 * @description Validates that the parameters of a ban event are known names inside its body.
 */
export class KnownNamesEventBanTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Names Event Ban - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the parameters of a ban event";
}
