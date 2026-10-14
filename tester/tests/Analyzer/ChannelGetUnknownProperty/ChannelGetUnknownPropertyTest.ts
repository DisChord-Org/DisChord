import { Test } from "../../../Test";

/**
 * @class ChannelGetUnknownPropertyTest
 * @description Validates that a typo in a property of `obtener canal` is an error instead of being ignored.
 */
export class ChannelGetUnknownPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get Unknown Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw on a property obtener canal does not take';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'obtener canal' no admite 'nomre'";
}
