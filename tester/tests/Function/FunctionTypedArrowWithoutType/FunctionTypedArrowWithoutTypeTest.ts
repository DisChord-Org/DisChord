import { Test } from "../../../Test";

/**
 * @class FunctionTypedArrowWithoutTypeTest
 * @description Validates that an arrow with no type after it is rejected.
 */
export class FunctionTypedArrowWithoutTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Arrow Without Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a return arrow with no type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Se esperaba un tipo válido después de 'tipo'";
}
