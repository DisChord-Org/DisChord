import { Test } from "../../../Test";

/**
 * @class VariableUnionFormatRoundTripMismatchTest
 * @description Validates that rewriting the type shown in an error message rejects the same value with the same type text.
 */
export class VariableUnionFormatRoundTripMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Format Round Trip Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to show the same type text when the written-back type rejects a value";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero|(texto[])'";
}
