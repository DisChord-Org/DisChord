import { Test } from "../../../Test";

/**
 * @class LoopEvalOnceObjectTest
 * @description Validates that a call returning an object is evaluated once and its keys are iterated.
 */
export class LoopEvalOnceObjectTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Eval Once Object - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to evaluate a call returning an object once and iterate its keys";
}
