import { Test } from "../../../Test";

/**
 * @class VariableAwaitReceiverShadowedClassTest
 * @description Pins today's behavior: an identifier naming a class of the file is resolved as that class before anything else, even when a parameter of the same name shadows it, so the call is awaited by the class's method.
 */
export class VariableAwaitReceiverShadowedClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Receiver Shadowed Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve a receiver named like a class of the file as that class even when a parameter shadows it";
}
