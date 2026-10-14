import { Test } from "../../../Test";

/**
 * @class IndexAssignParamMismatchTest
 * @description Validates that an element of a parameter declared with a list type is checked on assignment.
 */
export class IndexAssignParamMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign Param Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a texto assigned to an element of a numero list parameter";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'l[0]' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
