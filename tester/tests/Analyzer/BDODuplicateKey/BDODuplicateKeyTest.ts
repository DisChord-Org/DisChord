import { Test } from "../../../Test";

/**
 * @class BDODuplicateKeyTest
 * @description Validates that a repeated property key in one block is an error instead of the last one winning silently.
 */
export class BDODuplicateKeyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Duplicate Key - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when a property is declared twice';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La propiedad 'nombre' está repetida";
}
