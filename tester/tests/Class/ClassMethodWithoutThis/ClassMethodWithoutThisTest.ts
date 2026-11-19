import { Test } from "../../../Test";

/**
 * @class ClassMethodWithoutThisTest
 * @description Validates that a method called from another without `esta` is rejected.
 */
export class ClassMethodWithoutThisTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Method Without This - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a method called without esta";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'sumar' es un método de la clase 'Contador', no un nombre suelto: escribe 'esta.sumar'";
}
