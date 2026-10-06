import { Test } from "../../../Test";

/**
 * @class EventNameOptionTypeConstructorTest
 * @description Validates that a command option type named after a member `Object.prototype` provides is reported as unknown instead of being emitted as that member.
 */
export class EventNameOptionTypeConstructorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Name Option Type Constructor - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option type whose name is an inherited object member";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo de opción no reconocido en 'dato'";
}
