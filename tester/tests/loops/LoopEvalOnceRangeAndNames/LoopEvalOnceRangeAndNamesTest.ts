import { Test } from "../../../Test";

/**
 * @class LoopEvalOnceRangeAndNamesTest
 * @description Validates that a range, a list and an object read by name keep the same loops as before.
 */
export class LoopEvalOnceRangeAndNamesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Eval Once Range And Names - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave loops over a range or over names unchanged";
}
