import { Test } from "../../../Test";

/**
 * @class IndexAssignTupleMismatchTest
 * @description Validates that assigning to a tuple position a value of another type is rejected.
 */
export class IndexAssignTupleMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Assign Tuple Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a texto assigned to the numero position of a tuple";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'p[0]' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
