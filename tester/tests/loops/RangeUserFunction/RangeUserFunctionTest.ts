import { Test } from "../../../Test";

/**
 * @class RangeUserFunctionTest
 * @description Validates that a file that declares its own `rango` may still call it as a value.
 */
export class RangeUserFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Range User Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a call to a rango the file declares alone";
}
