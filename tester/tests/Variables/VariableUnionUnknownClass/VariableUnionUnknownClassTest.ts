import { Test } from "../../../Test";

/**
 * @class VariableUnionUnknownClassTest
 * @description Validates that an unknown name inside a union is rejected.
 */
export class VariableUnionUnknownClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Unknown Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an unknown type name inside a union";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'mango'";
}
