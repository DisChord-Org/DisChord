import { Test } from "../../../Test";

/**
 * @class MemberReadMethodTypedTest
 * @description Validates that reading a method of a core library class on a typed receiver, without calling it, is rejected.
 */
export class MemberReadMethodTypedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Read Method Typed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reading Fecha.dia without calling it";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'dia' es un método de Fecha: llámalo con paréntesis, dia()";
}
