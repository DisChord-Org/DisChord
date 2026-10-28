import { Test } from "../../../Test";

/**
 * @class CollectorKeyWithoutButtonTest
 * @description Validates that a key of alPulsarId that is the id of no button of its message is rejected, listing the ids there are.
 */
export class CollectorKeyWithoutButtonTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Key Without Button - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a key that matches no button id";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "alPulsarId espera un botón con id 'aceptr' en el mensaje 'msg'. Ids disponibles: aceptar.";
}
