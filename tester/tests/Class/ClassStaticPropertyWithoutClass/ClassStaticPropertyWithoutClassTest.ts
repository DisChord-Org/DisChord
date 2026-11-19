import { Test } from "../../../Test";

/**
 * @class ClassStaticPropertyWithoutClassTest
 * @description Validates that a `@fijar` property used by its bare name is rejected, with the class as what to write before it.
 */
export class ClassStaticPropertyWithoutClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Static Property Without Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a static property used by its bare name";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'total' es una propiedad de la clase 'Contador', no un nombre suelto: escribe 'Contador.total'";
}
