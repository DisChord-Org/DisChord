import { Test } from "../../../Test";

/**
 * @class MessageUnknownPropertyTest
 * @description Validates that `enviar mensaje` rejects a misspelled property (`contnido`) instead of sending an empty message, while `boton` and `embed` stay accepted.
 */
export class MessageUnknownPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Unknown Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when an enviar mensaje block has a property it does not take';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'mensaje' no admite 'contnido'";
}
