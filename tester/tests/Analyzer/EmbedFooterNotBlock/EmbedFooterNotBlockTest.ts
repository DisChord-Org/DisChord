import { Test } from "../../../Test";

/**
 * @class EmbedFooterNotBlockTest
 * @description Validates that it has to reject the footer of an embed that is not a block.
 */
export class EmbedFooterNotBlockTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Footer Not Block - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject the footer of an embed that is not a block";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'pie' debe ser un bloque";
}
