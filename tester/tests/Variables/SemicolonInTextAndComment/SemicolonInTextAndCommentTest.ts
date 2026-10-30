import { Test } from "../../../Test";

/**
 * @class SemicolonInTextAndCommentTest
 * @description Validates that a `;` inside a text or a comment is part of it and is not rejected.
 */
export class SemicolonInTextAndCommentTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Semicolon In Text And Comment - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a semicolon inside a text or a comment";
}
