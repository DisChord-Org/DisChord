import { Test } from "../../../Test";

/**
 * @class ClassPropertyWithoutThisTest
 * @description Validates that a property used in a method without `esta` is rejected, since it would be a variable that does not exist when run.
 */
export class ClassPropertyWithoutThisTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Property Without This - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a property used without esta";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'valor' es una propiedad de la clase 'Contador', no un nombre suelto: escribe 'esta.valor'";
}
