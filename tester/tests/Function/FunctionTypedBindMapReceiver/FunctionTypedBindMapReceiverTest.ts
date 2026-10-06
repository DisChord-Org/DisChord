import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindMapReceiverTest
 * @description Validates that a parameter annotated with a core library class types its receiver inside the body, so `tiene` becomes the member of that class (`Mapa.tiene` is `has`).
 */
export class FunctionTypedBindMapReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Map Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate a member called on a typed parameter after the class of the parameter";
}
