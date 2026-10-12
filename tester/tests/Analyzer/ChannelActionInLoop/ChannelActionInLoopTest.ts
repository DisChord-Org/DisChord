import { Test } from "../../../Test";

/**
 * @class ChannelActionInLoopTest
 * @description Validates the preventive barrier against mass creation and deletion: a channel action inside a `para` loop is rejected.
 */
export class ChannelActionInLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Action In Loop - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a channel action is used inside a loop';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no puede usarse dentro de un bucle";
}
