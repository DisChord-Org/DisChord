import { Test } from "../../../Test";

/**
 * @class ImportRelativeMissingTest
 * @description Validates that `importar` rejects, at analysis time, a relative path with no matching `.chord` source next to the importing file.
 */
export class ImportRelativeMissingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Import Relative Missing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an import whose relative module does not exist";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se encontró el módulo './noexiste'";
}
