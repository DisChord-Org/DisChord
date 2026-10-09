import { Test } from "../../../Test";

/**
 * @class DeclareVariableNamedLikeCoreLibTest
 * @description Validates that a variable can not be named like a class of the core library.
 */
export class DeclareVariableNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Variable Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a variable named like a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable 'Mates': es el nombre de una clase de la biblioteca estándar";
}
