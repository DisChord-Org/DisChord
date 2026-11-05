import { Test } from "../../../Test";

/**
 * @class ModerationBanMissingUserTest
 * @description It has to throw when banear miembro has no usuario
 */
export class ModerationBanMissingUserTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Ban Missing User - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when banear miembro has no usuario";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'banear miembro' se esperaba 'usuario'.";
}
