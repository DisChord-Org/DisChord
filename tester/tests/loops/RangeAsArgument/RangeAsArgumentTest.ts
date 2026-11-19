import { Test } from "../../../Test";

/**
 * @class RangeAsArgumentTest
 * @description Validates that a `rango` inside a loop, but not what the loop goes over, is rejected too.
 */
export class RangeAsArgumentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Range As Argument - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a rango passed as an argument";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'rango' solo puede usarse como el recorrido de un 'para'";
}
