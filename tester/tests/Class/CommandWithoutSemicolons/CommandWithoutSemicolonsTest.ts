import { Test } from "../../../Test";

/**
 * @class CommandWithoutSemicolonsTest
 * @description Validates that a command writes its properties without `;` and starts its code after an empty line.
 */
export class CommandWithoutSemicolonsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Without Semicolons - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to take the properties of a command with no semicolons and the code after an empty line';
}
