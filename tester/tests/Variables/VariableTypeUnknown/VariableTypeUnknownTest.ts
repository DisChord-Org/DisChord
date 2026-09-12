import { Test } from "../../../Test";

/**
 * @class VariableTypeUnknownTest
 * @description Validates that `tipo <nombre>` rejects a name outside the known primitive set
 * (texto, numero, booleano, indefinido, objeto) at parse time, since the type name is read as a
 * plain identifier rather than a reserved keyword (see `VariableParser.parseTypeAnnotation`).
 */
export class VariableTypeUnknownTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Type Unknown - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a 'tipo' annotation naming a type outside the known primitive set";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'mango'";
}
