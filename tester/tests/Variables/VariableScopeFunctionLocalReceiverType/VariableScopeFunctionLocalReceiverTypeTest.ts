import { Test } from "../../../Test";

/**
 * @class VariableScopeFunctionLocalReceiverTypeTest
 * @description Validates that a local variable keeps its inferred type after the function scope is left, so a core library member called on it is typed after its receiver.
 */
export class VariableScopeFunctionLocalReceiverTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Scope Function Local Receiver Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an annotation contradicting the return type of a member called on a function-local variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
