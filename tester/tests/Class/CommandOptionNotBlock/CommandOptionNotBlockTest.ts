import { Test } from "../../../Test";

/**
 * @class CommandOptionNotBlockTest
 * @description It has to reject an option that is not a block instead of failing while reading its type
 */
export class CommandOptionNotBlockTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Not Block - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an option that is not a block instead of failing while reading its type";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La opción 'a' del comando 'A' debe ser un bloque con sus propiedades";
}
