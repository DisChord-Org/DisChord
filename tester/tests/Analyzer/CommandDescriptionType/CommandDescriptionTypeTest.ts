import { Test } from "../../../Test";

/**
 * @class CommandDescriptionTypeTest
 * @description Validates that it has to reject a number as the description of a command.
 */
export class CommandDescriptionTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Description Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the description of a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'comando' espera un valor de tipo 'texto' en 'descripcion', se recibió 'numero'";
}
