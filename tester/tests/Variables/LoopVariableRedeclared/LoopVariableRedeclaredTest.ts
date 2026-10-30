import { Test } from "../../../Test";

/**
 * @class LoopVariableRedeclaredTest
 * @description Validates that the variable of a loop is declared in the loop, so declaring it again in the body is a duplicate.
 */
export class LoopVariableRedeclaredTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable Redeclared - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject declaring the variable of a loop again in its body";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Identificador duplicado: 'x'";
}
