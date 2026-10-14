import { Test } from "../../../Test";

/**
 * @class IndexAssignListMismatchTest
 * @description Validates that assigning a value of another type to an element of a typed list is rejected.
 */
export class IndexAssignListMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign List Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a texto assigned to an element of a numero list";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'notas[0]' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
