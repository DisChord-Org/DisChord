import { Test } from "../../../Test";

/**
 * @class BDOCodeWithoutBlankLineTest
 * @description Validates that code right after a property, with no empty line between them, is an error that asks for it.
 */
export class BDOCodeWithoutBlankLineTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Code Without Blank Line - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when code follows the properties without an empty line';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Separa el código de las propiedades con una línea en blanco";
}
