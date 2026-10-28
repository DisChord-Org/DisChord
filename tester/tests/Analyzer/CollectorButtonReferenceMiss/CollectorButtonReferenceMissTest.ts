import { Test } from "../../../Test";

/**
 * @class CollectorButtonReferenceMissTest
 * @description Validates that a key matching no id is rejected when the message uses a button declared on its own.
 */
export class CollectorButtonReferenceMissTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Button Reference Miss - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a key against a referenced button";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "alPulsarId espera un botón con id 'otro' en el mensaje 'msg'. Ids disponibles: confirmar.";
}
