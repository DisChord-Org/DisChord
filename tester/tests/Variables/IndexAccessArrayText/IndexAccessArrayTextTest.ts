import { Test } from "../../../Test";

/**
 * @class IndexAccessArrayTextTest
 * @description Validates that indexing a list of texto gives texto.
 */
export class IndexAccessArrayTextTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Access Array Text - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit texto members on an element of a texto list";
}
