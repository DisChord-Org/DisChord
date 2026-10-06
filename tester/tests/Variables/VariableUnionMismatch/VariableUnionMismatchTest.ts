import { Test } from "../../../Test";

/**
 * @class VariableUnionMismatchTest
 * @description Validates that a value that fits no member of a mixed union is rejected, with a stable and readable union in the message.
 */
export class VariableUnionMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a value that fits no member of a mixed union";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'Mapa|texto'";
}
