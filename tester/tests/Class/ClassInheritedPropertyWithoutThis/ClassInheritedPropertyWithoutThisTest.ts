import { Test } from "../../../Test";

/**
 * @class ClassInheritedPropertyWithoutThisTest
 * @description Validates that an inherited property used without `esta` is rejected with the same hint, not as an undeclared name.
 */
export class ClassInheritedPropertyWithoutThisTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Inherited Property Without This - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an inherited property used without esta";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'valor' es una propiedad de la clase 'Contador', no un nombre suelto: escribe 'esta.valor'";
}
