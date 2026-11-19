import { Test } from "../../../Test";

/**
 * @class KnownMemberUnknownOnTextTest
 * @description Validates that it has to reject a member that a text does not have.
 */
export class KnownMemberUnknownOnTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Member Unknown On Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a member that a text does not have";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'noExiste' no existe en un valor de tipo 'texto'";
}
