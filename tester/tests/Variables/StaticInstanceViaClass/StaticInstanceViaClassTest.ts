import { Test } from "../../../Test";

/**
 * @class StaticInstanceViaClassTest
 * @description Validates that an instance member reached through its core library class is rejected.
 */
export class StaticInstanceViaClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Static Instance Via Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an instance member used on the class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'limpiar' es un método de instancia de Texto, no se puede usar sobre la clase";
}
