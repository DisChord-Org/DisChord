import { Test } from "../../../Test";

/**
 * @class DeclareImportNamedLikeCoreLibTest
 * @description Validates that an imported name can not be the name of a class of the core library.
 */
export class DeclareImportNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Import Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an imported name that is a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar el nombre importado 'Mapa': es el nombre de una clase de la biblioteca estándar";
}
