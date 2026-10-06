import { Test } from "../../../Test";

/**
 * @class VariableCoreLibConjuntoMismatch2Test
 * @description Validates that annotating `Conjunto.tiene` as `numero` is rejected.
 */
export class VariableCoreLibConjuntoMismatch2Test extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Conjunto Mismatch 2 - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation that contradicts the return type of Conjunto.tiene";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero'";
}
