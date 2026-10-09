import { Test } from "../../../Test";

/**
 * @class DeclareInjectedNameAsVariableTest
 * @description Validates that a name DisChord puts in scope can not be declared as a variable.
 */
export class DeclareInjectedNameAsVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declare Injected Name As Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a variable named like an identifier reserved by DisChord";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar la variable 'canal': es un identificador reservado por DisChord";
}
