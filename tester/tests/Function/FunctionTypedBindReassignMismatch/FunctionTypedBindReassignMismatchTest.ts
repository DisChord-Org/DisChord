import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindReassignMismatchTest
 * @description Validates that reassigning a typed parameter with a value of another type is rejected.
 */
export class FunctionTypedBindReassignMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Reassign Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reassigning a typed parameter with another type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La variable 'c' es de tipo 'Mapa' pero se le asignó un valor de tipo 'numero'";
}
