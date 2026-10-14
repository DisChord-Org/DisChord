import { Test } from "../../../Test";

/**
 * @class ImprimirFallsBackToConsoleTest
 * @description Validates that `imprimir` compiles at the top level and in a function that has no
 * client: it goes through the client's logger when there is one and through `console.log`
 * otherwise, importing the console runtime for the fallback.
 */
export class ImprimirFallsBackToConsoleTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Imprimir Falls Back To Console - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to print through console.log when there is no client with a logger in scope';
}
