import { Test } from "../../../Test";

/**
 * @class VariableUnionVoidTest
 * @description Validates that `nada` is rejected in a `var` annotation.
 */
export class VariableUnionVoidTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Void - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject nada as a variable type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'nada' solo puede usarse como tipo de retorno";
}
