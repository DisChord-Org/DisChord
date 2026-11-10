import { Test } from "../../../Test";

/**
 * @class ExportInsideCommandTest
 * @description It has to reject exportar anywhere but the top level of the file
 */
export class ExportInsideCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Export Inside Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject exportar anywhere but the top level of the file";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'exportar' solo puede usarse en el nivel superior del archivo";
}
