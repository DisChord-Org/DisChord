import { Test } from "../../../Test";

/**
 * @class ChannelActionOutsideAsyncTest
 * @description Validates that a channel action, emitted as an `await`, follows the awaited-call rule: an error in a plain function.
 */
export class ChannelActionOutsideAsyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Action Outside Async - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a channel action is used in a function that is not asynchronous';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'borrar canal' espera una respuesta";
}
