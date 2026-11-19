import { Test } from "../../../Test";

/**
 * @class ButtonPropertyPlainValueTest
 * @description Validates that it has to reject a text as the button of a message.
 */
export class ButtonPropertyPlainValueTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Button Property Plain Value - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text as the button of a message";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'boton' espera un bloque { ... }, el nombre de un botón declarado o una lista de ellos, se recibió un valor de tipo 'texto'";
}
