import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsValidTest
 * @description Validates that arguments of the declared types are accepted, and so are arguments of unknown type or `cualquiera`.
 */
export class FunctionTypedArgsValidTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Valid - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile calls whose arguments fit the declared parameter types or have an unknown type";
}
