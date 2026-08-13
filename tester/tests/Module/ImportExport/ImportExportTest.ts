import { Test } from "../../../Test";

/**
 * @class ImportExportTest
 * @description Validates that DisChord correctly compiles destructured imports and function exports.
 */
export class ImportExportTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Import Export - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate ESM import and export statements correctly';
}
