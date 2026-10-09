import { Test } from "../../../Test";

/**
 * @class ClassOverrideAsyncSameTest
 * @description Validates that overrides that keep their asynchrony, sync or async, compile and run, and so do methods the base lacks.
 */
export class ClassOverrideAsyncSameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassOverrideAsync Same - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept overrides with the same asynchrony";
}
