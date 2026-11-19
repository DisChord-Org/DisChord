import { Test } from "../../../Test";

/**
 * @class CommentsAndTextsClosedTest
 * @description Validates that closed comments and texts still compile, with one that ends where the file does.
 */
export class CommentsAndTextsClosedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Comments And Texts Closed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept closed comments and texts, even at the very end of the file";
}
