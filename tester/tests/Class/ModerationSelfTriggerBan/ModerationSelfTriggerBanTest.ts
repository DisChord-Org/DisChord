import { Test } from "../../../Test";

/**
 * @class ModerationSelfTriggerBanTest
 * @description It has to throw on banear inside usuarioDesbaneado
 */
export class ModerationSelfTriggerBanTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Self Trigger Ban - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw on banear inside usuarioDesbaneado";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "lo dispararía a sí mismo";
}
