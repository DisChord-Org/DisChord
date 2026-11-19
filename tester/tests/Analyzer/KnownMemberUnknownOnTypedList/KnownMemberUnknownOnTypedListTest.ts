import { Test } from "../../../Test";

/**
 * @class KnownMemberUnknownOnTypedListTest
 * @description Validates that it has to reject a member that a list of an annotated type does not have.
 */
export class KnownMemberUnknownOnTypedListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Member Unknown On Typed List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a member that a list of an annotated type does not have";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'noExiste' no existe en un valor de tipo 'numero[]'";
}
