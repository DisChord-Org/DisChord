import { Test } from "../../../Test";

/**
 * @class LoopEvalOnceRangeBoundTest
 * @description Validates that the end of a `rango` that is not a written number is evaluated once, so a body that changes it does not move the end.
 */
export class LoopEvalOnceRangeBoundTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Eval Once Range Bound - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to evaluate the end of a range once";
}
