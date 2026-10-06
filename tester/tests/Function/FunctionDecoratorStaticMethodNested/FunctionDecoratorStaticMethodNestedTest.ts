import { Test } from "../../../Test";

/**
 * @class FunctionDecoratorStaticMethodNestedTest
 * @description Regression test: a `@fijar` method has to stay static when its body declares a function, which must not take the decorator.
 */
export class FunctionDecoratorStaticMethodNestedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Decorator Static Method Nested - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep a decorated method static and leave a function nested in it untouched";
}
