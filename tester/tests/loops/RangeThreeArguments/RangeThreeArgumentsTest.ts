import { Test } from "../../../Test";

/**
 * @class RangeThreeArgumentsTest
 * @description Validates that a third argument of `rango` is rejected instead of ignored.
 */
export class RangeThreeArgumentsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Range Three Arguments - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a rango with three arguments";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'rango' necesita uno o dos argumentos (el final, o el inicio y el final) y se encontraron 3";
}
