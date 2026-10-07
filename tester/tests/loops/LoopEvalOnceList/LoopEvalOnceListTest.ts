import { Test } from "../../../Test";

/**
 * @class LoopEvalOnceListTest
 * @description Regression test: the iterable of a loop was emitted three times, so a call in it ran several times. It has to run once.
 */
export class LoopEvalOnceListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Eval Once List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to evaluate a call used as the iterable of a loop once";
}
