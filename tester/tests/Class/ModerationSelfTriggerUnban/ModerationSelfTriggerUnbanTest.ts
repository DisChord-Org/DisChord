import { Test } from "../../../Test";

/**
 * @class ModerationSelfTriggerUnbanTest
 * @description It has to throw on desbanear inside usuarioBaneado
 */
export class ModerationSelfTriggerUnbanTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Self Trigger Unban - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw on desbanear inside usuarioBaneado";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "lo dispararía a sí mismo";
}
