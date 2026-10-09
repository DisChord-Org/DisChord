import { Test } from "../../../Test";

/**
 * @class DeclareClassNamedLikeCoreLibTest
 * @description Validates that a class can not be named like a class of the core library.
 */
export class DeclareClassNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Class Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a class named like a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la clase 'Mapa': es el nombre de una clase de la biblioteca estándar";
}
