import { Test } from "../../../Test";

/**
 * @class LoopEvalOnceAwaitTest
 * @description Validates that an awaited call used as the iterable stays outside the arrow that picks what to iterate, so the `await` is valid, and runs once.
 */
export class LoopEvalOnceAwaitTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Eval Once Await - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to evaluate an awaited call used as the iterable once";
}
