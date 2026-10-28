import { Test } from "../../../Test";

/**
 * @class CommandOptionShadowsInjectedCanalTest
 * @description Validates that an option named `canal`, which no other injected name reads, takes the place of the injected one.
 */
export class CommandOptionShadowsInjectedCanalTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Shadows Injected Canal - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to declare an option named canal once, from the options";
}
