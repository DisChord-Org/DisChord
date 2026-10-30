import { Test } from "../../../Test";

/**
 * @class UserExtensionsNoDiscordContextTest
 * @description It must not import the user extensions for a helper in a file without commands, events or bot
 */
export class UserExtensionsNoDiscordContextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'User Extensions No Discord Context - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It must not import the user extensions for a helper in a file without commands, events or bot";
}
