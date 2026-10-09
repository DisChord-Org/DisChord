import { Test } from "../../../Test";

/**
 * @class DeclareLoopVariableNamedLikeCoreLibTest
 * @description Validates that the variable of a loop can not be named like a class of the core library.
 */
export class DeclareLoopVariableNamedLikeCoreLibTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Loop Variable Named Like Core Lib - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a loop variable named like a core library class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable del bucle 'Fecha': es el nombre de una clase de la biblioteca estándar";
}
