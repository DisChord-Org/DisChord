import { Test } from "../../../Test";

/**
 * @class DeclareFunctionNamedLikeCoreLibTest
 * @description Validates that a free function can not be named like a class of the core library.
 */
export class DeclareFunctionNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Function Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a function named like a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la función 'Mapa': es el nombre de una clase de la biblioteca estándar";
}
