import { Test } from "../../../Test";

/**
 * @class EmbedFieldsNotListTest
 * @description Validates that it has to reject the fields of an embed that are not a list.
 */
export class EmbedFieldsNotListTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Fields Not List - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the fields of an embed that are not a list";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'campos' debe ser una lista de bloques";
}
