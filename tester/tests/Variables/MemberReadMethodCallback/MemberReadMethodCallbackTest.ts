import { Test } from "../../../Test";

/**
 * @class MemberReadMethodCallbackTest
 * @description Validates that passing a method of a typed receiver as a callback is rejected, as it would lose its receiver.
 */
export class MemberReadMethodCallbackTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Read Method Callback - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a method passed as a callback";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'limpiar' es un método de Texto: llámalo con paréntesis, limpiar()";
}
