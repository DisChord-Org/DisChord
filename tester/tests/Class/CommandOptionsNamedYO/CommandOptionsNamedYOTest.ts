import { Test } from "../../../Test";

/**
 * @class CommandOptionsNamedYOTest
 * @description Validates that options called like operator words (`y`, `o`) are options of their own, not the operator joining two blocks.
 */
export class CommandOptionsNamedYOTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Options Named Y O - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to accept command options named y and o after another option';
}
