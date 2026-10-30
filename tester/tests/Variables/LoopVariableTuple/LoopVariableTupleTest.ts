import { Test } from "../../../Test";

/**
 * @class LoopVariableTupleTest
 * @description Validates that the variable of a loop over a tuple is any of the types of its elements.
 */
export class LoopVariableTupleTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Tuple - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the variable of a loop over a tuple as the union of its elements";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'numero|texto'";
}
