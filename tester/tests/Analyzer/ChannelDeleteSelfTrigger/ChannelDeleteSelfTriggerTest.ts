import { Test } from "../../../Test";

/**
 * @class ChannelDeleteSelfTriggerTest
 * @description Validates that `borrar canal` inside `canalBorrado` is rejected.
 */
export class ChannelDeleteSelfTriggerTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Delete Self Trigger - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when borrar canal is used in the event it triggers';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "lo dispararía a sí mismo";
}
