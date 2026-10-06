import { Test } from "../../../Test";

/**
 * @class EventNameIntentConstructorTest
 * @description Validates that an intent named after a member `Object.prototype` provides is reported as unknown instead of being emitted as that member.
 */
export class EventNameIntentConstructorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Name Intent Constructor - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an intent whose name is an inherited object member";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Intención desconocida: constructor";
}
