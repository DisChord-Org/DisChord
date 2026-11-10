import { Test } from "../../../Test";

/**
 * @class ReservedWordCommandOptionTest
 * @description It has to reject a command option named with a reserved word of JavaScript
 */
export class ReservedWordCommandOptionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Reserved Word Command Option - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a command option named with a reserved word of JavaScript";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "La opción 'class' del comando 'A' no puede llamarse así: es una palabra reservada de JavaScript.";
}
