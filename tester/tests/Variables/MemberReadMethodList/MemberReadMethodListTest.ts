import { Test } from "../../../Test";

/**
 * @class MemberReadMethodListTest
 * @description Validates that reading a lista method without calling it is rejected.
 */
export class MemberReadMethodListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Read Method List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reading a lista method without calling it";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'agregar' es un método de Lista: llámalo con paréntesis, agregar()";
}
