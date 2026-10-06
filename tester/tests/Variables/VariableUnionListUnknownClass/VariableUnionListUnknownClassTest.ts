import { Test } from "../../../Test";

/**
 * @class VariableUnionListUnknownClassTest
 * @description Validates that an unknown class inside an array inside a union is rejected.
 */
export class VariableUnionListUnknownClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union List Unknown Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown class nested in an array member of a union";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'Caja'";
}
