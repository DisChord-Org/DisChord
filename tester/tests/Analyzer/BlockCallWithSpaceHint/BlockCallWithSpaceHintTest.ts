import { Test } from "../../../Test";

/**
 * @class BlockCallWithSpaceHintTest
 * @description Validates that a statement of a command written `f ("x")` with a space, which reads as a property, is rejected with a hint about writing the call with no space.
 */
export class BlockCallWithSpaceHintTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Block Call With Space Hint - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to say how to write a call that the block read as a property';

    /**
     * @type {string}
     */
    public readonly expectedError: string = "escríbelo pegado";
}
