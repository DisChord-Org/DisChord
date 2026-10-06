import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnValidTest
 * @description Validates that a returned value matching the declared return type is accepted, and so is one of unknown type or any value for `cualquiera`.
 */
export class FunctionTypedReturnValidTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Valid - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile functions whose returned values fit their declared return type";
}
