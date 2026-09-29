import { Test } from "../../../Test";

/**
 * @class ImportLibraryMissingTest
 * @description Validates that the `importar X` shorthand (`lib:X`) is rejected when the library isn't installed under lib/X/src/index.js.
 */
export class ImportLibraryMissingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Import Library Missing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a lib import whose library is not installed";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se encontró el módulo 'lib:noexiste'";
}
