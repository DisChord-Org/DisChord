import { Test } from "../../../Test";

/**
 * @class MessageWordOutsideEventTest
 * @description Validates that `mensaje` outside a message event is an undeclared name, like any other.
 */
export class MessageWordOutsideEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Word Outside Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject mensaje used where it is not declared";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'mensaje' no está declarado.";
}
