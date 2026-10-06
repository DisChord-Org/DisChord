import { Test } from "../../../Test";

/**
 * @class FunctionDecoratorAsyncParentNestedSyncTest
 * @description Regression test: the decorators of a function were read after parsing its body, so a function nested in it consumed them. A `@asincrono` parent has to stay async, and its plain nested function must not become async.
 */
export class FunctionDecoratorAsyncParentNestedSyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Decorator Async Parent Nested Sync - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep a decorated parent function async and its nested function plain, so calling the nested one from the parent compiles without await";
}
