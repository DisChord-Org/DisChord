import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindSetReceiverTest
 * @description Validates that a `Conjunto` parameter resolves `agregar` as `add`.
 */
export class FunctionTypedBindSetReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Set Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate agregar on a Conjunto parameter as add";
}
