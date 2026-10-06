import { Test } from "../../../Test";

/**
 * @class VariableCoreLibConjuntoMismatchTest
 * @description Validates that annotating `Conjunto.tamano` as `texto` is rejected.
 */
export class VariableCoreLibConjuntoMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Conjunto Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the type of Conjunto.tamano";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto'";
}
