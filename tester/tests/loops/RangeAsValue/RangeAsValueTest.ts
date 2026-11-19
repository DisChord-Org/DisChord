import { Test } from "../../../Test";

/**
 * @class RangeAsValueTest
 * @description Validates that `rango` is rejected where it is not what a `para` goes over: it would reach the JavaScript as a call to a function that does not exist.
 */
export class RangeAsValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Range As Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a rango used as a value";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'rango' solo puede usarse como el recorrido de un 'para'";
}
