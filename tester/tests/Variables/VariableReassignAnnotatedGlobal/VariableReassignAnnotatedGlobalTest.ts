import { Test } from "../../../Test";

/**
 * @class VariableReassignAnnotatedGlobalTest
 * @description Validates that an annotated variable reassigned at the top level with another type is still an error.
 */
export class VariableReassignAnnotatedGlobalTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Annotated Global - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reassigning an annotated variable";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'b' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
