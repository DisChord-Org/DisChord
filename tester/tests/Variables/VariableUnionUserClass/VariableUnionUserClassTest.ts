import { Test } from "../../../Test";

/**
 * @class VariableUnionUserClassTest
 * @description Validates that a user class declared further down the file can be written in a union (`Caja|indefinido`).
 */
export class VariableUnionUserClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union User Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a user class declared later in a union";
}
