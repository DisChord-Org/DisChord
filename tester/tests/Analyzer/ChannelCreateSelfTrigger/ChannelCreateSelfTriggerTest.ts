import { Test } from "../../../Test";

/**
 * @class ChannelCreateSelfTriggerTest
 * @description Validates that `crear canal` inside `canalCreado` is rejected: it would create channels endlessly.
 */
export class ChannelCreateSelfTriggerTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Create Self Trigger - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when crear canal is used in the event it triggers';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "lo dispararía a sí mismo";
}
