import { Test } from "../../../Test";

/**
 * @class VariableVoidNameAsIdentifierTest
 * @description Validates that `nada` is only a type name where a type is expected: it is still valid as a variable, a function and a parameter name.
 */
export class VariableVoidNameAsIdentifierTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Void Name As Identifier - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept nada as a variable, function and parameter name";
}
