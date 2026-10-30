import { Test } from "../../../Test";

/**
 * @class TypedEventParamOkTest
 * @description It has to accept the name of a user where a text is expected
 */
export class TypedEventParamOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Typed Event Param Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the name of a user where a text is expected";
}
