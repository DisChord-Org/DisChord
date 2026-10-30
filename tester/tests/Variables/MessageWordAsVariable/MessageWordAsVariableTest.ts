import { Test } from "../../../Test";

/**
 * @class MessageWordAsVariableTest
 * @description Validates that `mensaje` can name a variable, since only `enviar` is reserved.
 */
export class MessageWordAsVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Word As Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a variable named mensaje";
}
