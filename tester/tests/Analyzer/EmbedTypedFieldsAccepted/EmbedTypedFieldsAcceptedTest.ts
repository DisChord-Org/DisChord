import { Test } from "../../../Test";

/**
 * @class EmbedTypedFieldsAcceptedTest
 * @description Validates that it has to accept embed references, colors by name, number or variable, and values whose type fits or may fit.
 */
export class EmbedTypedFieldsAcceptedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Typed Fields Accepted - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept embed references, colors by name, number or variable, and values whose type fits or may fit";
}
