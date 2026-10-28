import { Test } from "../../../Test";

/**
 * @class CommandOptionShadowsInjectedTest
 * @description Validates that a command option named like a name the compiler injects into the command (`usuario`) wins: the generated code declares it once, from the options, and leaves out the injected one, which would be a SyntaxError next to it.
 */
export class CommandOptionShadowsInjectedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Shadows Injected - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to declare an option named like an injected name once, from the options";
}
