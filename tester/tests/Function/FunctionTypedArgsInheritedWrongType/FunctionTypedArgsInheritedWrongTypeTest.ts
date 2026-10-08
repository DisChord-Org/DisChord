import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsInheritedWrongTypeTest
 * @description Validates that `nuevo B(...)` is checked against the constructor B inherits from A.
 */
export class FunctionTypedArgsInheritedWrongTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Inherited Wrong Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an argument of the wrong type for an inherited constructor";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'B' es de tipo 'texto', se esperaba 'numero'";
}
