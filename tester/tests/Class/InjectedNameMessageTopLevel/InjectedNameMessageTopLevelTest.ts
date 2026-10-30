import { Test } from "../../../Test";

/**
 * @class InjectedNameMessageTopLevelTest
 * @description Validates that a variable named `mensaje` outside any event or command compiles.
 */
export class InjectedNameMessageTopLevelTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Message Top Level - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept var mensaje outside events";
}
