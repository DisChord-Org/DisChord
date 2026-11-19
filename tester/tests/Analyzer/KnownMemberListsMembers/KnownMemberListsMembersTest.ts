import { Test } from "../../../Test";

/**
 * @class KnownMemberListsMembersTest
 * @description Validates that it has to list the members of a small class when none is close to the unknown one.
 */
export class KnownMemberListsMembersTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Member Lists Members - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to list the members of a small class when none is close to the unknown one";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'guardar' no existe en un valor de tipo 'Mapa'. Mapa tiene: obtener / poner / tiene / borrar / limpiar / tamano.";
}
