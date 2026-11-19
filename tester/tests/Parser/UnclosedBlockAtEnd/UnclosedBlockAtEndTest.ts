import { Test } from "../../../Test";

/**
 * @class UnclosedBlockAtEndTest
 * @description It has to reject a block left open at the end of the file with a compiler error, not a TypeError
 */
export class UnclosedBlockAtEndTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Unclosed Block At End - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a block left open at the end of the file with a compiler error, not a TypeError";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Falta '}' para cerrar el bloque";
}
