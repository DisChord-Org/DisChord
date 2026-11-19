import { Test } from "../../../Test";

/**
 * @class JsTextLiteralNotJsTest
 * @description It has to treat a text literal that says js as a text, not as the js() statement
 */
export class JsTextLiteralNotJsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Js Text Literal Not Js - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to treat a text literal that says js as a text, not as the js() statement";
}
