import { Test } from "../../../Test";

/**
 * @class VariableScopeGenerationLocalReceiverTest
 * @description Validates that the generator reopens a function scope, so a member shared by several classes is translated after the receiver type of a function-local variable (a boolean keeps `longitud`, a list becomes `length`).
 */
export class VariableScopeGenerationLocalReceiverTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Generation Local Receiver - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate a shared member after the type of a local receiver inside a function";
}
