import { Test } from "../../../Test";

/**
 * @class NamesBdoKeyOutsideTest
 * @description Validates that the keys of an intelligent block are names only inside its body.
 */
export class NamesBdoKeyOutsideTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Bdo Key Outside - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a key of an intelligent block used outside of it";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'makima' no está declarado.";
}
