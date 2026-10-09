import { Test } from "../../../Test";

/**
 * @class DeclareParameterNamedLikeCoreLibTest
 * @description Validates that a parameter can not be named like a class of the core library.
 */
export class DeclareParameterNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Parameter Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a parameter named like a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar el parámetro 'Mates': es el nombre de una clase de la biblioteca estándar";
}
