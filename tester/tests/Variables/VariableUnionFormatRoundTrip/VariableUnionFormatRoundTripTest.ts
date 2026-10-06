import { Test } from "../../../Test";

/**
 * @class VariableUnionFormatRoundTripTest
 * @description Validates that a type shown in an error message can be written back in an annotation as is: `numero|(texto[])` is accepted and rebuilds the same type.
 */
export class VariableUnionFormatRoundTripTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Format Round Trip - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the type an error message shows for a union with an array member";
}
