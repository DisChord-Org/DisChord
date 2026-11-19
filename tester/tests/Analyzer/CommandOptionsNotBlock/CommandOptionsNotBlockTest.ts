import { Test } from "../../../Test";

/**
 * @class CommandOptionsNotBlockTest
 * @description Validates that it has to reject the options of a command that are not a block.
 */
export class CommandOptionsNotBlockTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Options Not Block - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the options of a command that are not a block";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'opciones' debe ser un bloque con una opción por nombre";
}
