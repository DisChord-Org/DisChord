import { Test } from "../../../Test";

/**
 * @class ChannelEditSelfTriggerTest
 * @description Validates that `editar canal` inside `canalEditado` is rejected: it would edit endlessly.
 */
export class ChannelEditSelfTriggerTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Edit Self Trigger - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when editar canal is used in the event it triggers';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "lo dispararía a sí mismo";
}
