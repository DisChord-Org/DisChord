import { Test } from "../../../Test";

/**
 * @class CollectorNoButtonsTest
 * @description Validates that a key is rejected when the message has no buttons at all.
 */
export class CollectorNoButtonsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector No Buttons - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a key when the message has no buttons";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "alPulsarId espera un botón con id 'aceptar' en el mensaje 'msg'. Ids disponibles: ninguno.";
}
