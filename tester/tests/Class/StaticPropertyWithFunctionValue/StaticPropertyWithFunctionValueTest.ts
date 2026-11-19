import { Test } from "../../../Test";

/**
 * @class StaticPropertyWithFunctionValueTest
 * @description It has to keep a property static when its value is a function, without the function taking the decorator
 */
export class StaticPropertyWithFunctionValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Static Property With Function Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep a property static when its value is a function, without the function taking the decorator";
}
