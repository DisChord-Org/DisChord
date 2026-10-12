import { Test } from "../../../Test";

/**
 * @class ChannelActionInAsyncFunctionTest
 * @description Validates that even an `@asincrono` function, which may await, is rejected: the context a channel action needs is only the command's or the event's.
 */
export class ChannelActionInAsyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Action In Async Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a channel action is used inside an @asincrono function';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "solo puede usarse dentro de un comando o un evento";
}
