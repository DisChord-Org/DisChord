import { Test } from "../../../Test";

/**
 * @class ModerationBanMissingReasonTest
 * @description It has to throw when banear miembro has no razon
 */
export class ModerationBanMissingReasonTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Ban Missing Reason - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when banear miembro has no razon";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'banear miembro' se esperaba 'razon'";
}
