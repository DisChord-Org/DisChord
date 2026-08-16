import { Test } from "../../../Test";

/**
 * @class DuplicateWholeFileDeclarationTest
 * @description Validates `SingleWholeFileDeclarationRule`: a `comando` and an `evento` (or any
 * two whole-file declarations) can't coexist in the same file.
 */
export class DuplicateWholeFileDeclarationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Duplicate Whole-File Declaration - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when a file declares more than one 'comando'/'evento'";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Solo se permite un 'comando' o 'evento' por archivo";
}
