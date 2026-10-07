import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionAsyncTest
 * @description Validates that a user `esperar` marked `@asincrono` is awaited because of its own decorator, not as the runtime helper.
 */
export class UserShadowsCorelibFunctionAsyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction Async - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await a user esperar through its own async marker";
}
