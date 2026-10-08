import { Test } from "../../../Test";

/**
 * @class VariableReassignAnnotatedInFunctionTest
 * @description Validates that an annotated variable reassigned inside a function with another type is still an error.
 */
export class VariableReassignAnnotatedInFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Annotated In Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reassigning an annotated variable in a function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'q' es de tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
