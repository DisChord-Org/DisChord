import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsInheritedValidTest
 * @description Validates that calls matching an inherited constructor, directly, up a chain and through super, compile and run.
 */
export class FunctionTypedArgsInheritedValidTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Inherited Valid - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile valid calls to inherited constructors and super";
}
