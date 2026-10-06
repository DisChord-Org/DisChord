import { Test } from "../../../Test";

/**
 * @class FunctionTypedReturnUnionWithNadaTest
 * @description Validates that a return type with `nada` in a union accepts a value, a `devolver` with no value and a body with no `devolver`.
 */
export class FunctionTypedReturnUnionWithNadaTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Return Union With Nada - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a missing return value when the declared type admits nada";
}
