import { Test } from "../../../Test";

/**
 * @class CommandWithoutBracesTest
 * @description It has to ask for the opening brace instead of naming a technical token
 */
export class CommandWithoutBracesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Without Braces - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to ask for the opening brace instead of naming a technical token";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Falta la llave '{' que abre el bloque";
}
