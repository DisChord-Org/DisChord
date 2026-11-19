import { Test } from "../../../Test";

/**
 * @class CommandOptionDescriptionTypeTest
 * @description Validates that it has to reject a number as the description of a command option.
 */
export class CommandOptionDescriptionTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Description Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the description of a command option";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'opcion' espera un valor de tipo 'texto' en 'descripcion', se recibió 'numero'";
}
