import { Test } from "../../../Test";

/**
 * @class CollectorFixedWithDynamicTest
 * @description Validates that a key matching a fixed id compiles in a message that also has a dynamic one.
 */
export class CollectorFixedWithDynamicTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Fixed With Dynamic - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a fixed id next to a dynamic one";
}
