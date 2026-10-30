import { Test } from "../../../Test";

/**
 * @class ReturnInferredUnknownParameterTest
 * @description Validates that returning a parameter without a type makes the return type unknown.
 */
export class ReturnInferredUnknownParameterTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Unknown Parameter - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave unknown the return type of a function that returns an untyped parameter";
}
