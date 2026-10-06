import { Test } from "../../../Test";

/**
 * @class VariableUnionVoidInUnionTest
 * @description Validates that `nada` inside a union is also rejected in a `var` annotation.
 */
export class VariableUnionVoidInUnionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Void In Union - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject nada inside a union in a variable type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'nada' solo puede usarse como tipo de retorno";
}
