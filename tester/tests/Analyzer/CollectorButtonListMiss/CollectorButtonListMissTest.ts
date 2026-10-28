import { Test } from "../../../Test";

/**
 * @class CollectorButtonListMissTest
 * @description Validates that a key matching none of the ids of a list of buttons is rejected.
 */
export class CollectorButtonListMissTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Button List Miss - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a key against a list of buttons";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "alPulsarId espera un botón con id 'tres' en el mensaje 'msg'. Ids disponibles: uno, dos.";
}
