import { Test } from "../../../Test";

/**
 * @class VariableUnionAnyTest
 * @description Validates that `cualquiera` absorbs the rest of a union (`cualquiera|texto` is `cualquiera`).
 */
export class VariableUnionAnyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Any - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept any value for a union containing cualquiera";
}
