import { Test } from "../../../Test";

/**
 * @class MemberCallPropertyTest
 * @description Validates that calling a property of a core library class on a typed receiver is rejected.
 */
export class MemberCallPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Call Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling a property as a method";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'longitud' es una propiedad de Texto, no un método";
}
