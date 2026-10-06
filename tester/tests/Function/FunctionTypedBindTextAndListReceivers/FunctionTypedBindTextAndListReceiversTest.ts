import { Test } from "../../../Test";

/**
 * @class FunctionTypedBindTextAndListReceiversTest
 * @description Validates that text and list parameters resolve `tiene` through their own class (`includes`).
 */
export class FunctionTypedBindTextAndListReceiversTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Bind Text And List Receivers - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to translate tiene on text and list parameters as includes";
}
