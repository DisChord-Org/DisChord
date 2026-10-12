import { Test } from "../../../Test";

/**
 * @class ChannelDeleteMissingReasonTest
 * @description Validates that `borrar canal` requires `razon`: a destructive action leaves its trace in the audit log.
 */
export class ChannelDeleteMissingReasonTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Delete Missing Reason - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when borrar canal has no razon';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'borrar canal' se esperaba 'razon'";
}
