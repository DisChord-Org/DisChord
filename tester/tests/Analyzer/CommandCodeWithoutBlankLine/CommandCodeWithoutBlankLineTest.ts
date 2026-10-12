import { Test } from "../../../Test";

/**
 * @class CommandCodeWithoutBlankLineTest
 * @description Validates that a command whose code starts right after its properties is rejected, asking for the empty line.
 */
export class CommandCodeWithoutBlankLineTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Code Without Blank Line - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when the code of a command follows its properties without an empty line';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Separa el código de las propiedades con una línea en blanco";
}
