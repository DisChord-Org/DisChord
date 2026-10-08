import { Test } from "../../../Test";

/**
 * @class StaticInstanceViaClassCallTest
 * @description Validates that calling an instance method through its class is rejected.
 */
export class StaticInstanceViaClassCallTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Static Instance Via Class Call - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject calling an instance method on the class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'tiene' es un método de instancia de Mapa, no se puede usar sobre la clase";
}
