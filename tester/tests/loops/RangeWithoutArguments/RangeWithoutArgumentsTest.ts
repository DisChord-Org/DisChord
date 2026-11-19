import { Test } from "../../../Test";

/**
 * @class RangeWithoutArgumentsTest
 * @description Validates that `rango()` is rejected instead of crashing the compiler.
 */
export class RangeWithoutArgumentsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Range Without Arguments - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a rango with no arguments";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'rango' necesita uno o dos argumentos (el final, o el inicio y el final) y se encontraron 0";
}
