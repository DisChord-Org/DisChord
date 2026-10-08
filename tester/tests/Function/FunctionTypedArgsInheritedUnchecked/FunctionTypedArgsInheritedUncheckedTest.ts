import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsInheritedUncheckedTest
 * @description Validates the cases left as they were: a hierarchy with no constructor, an unknown parent class and a cycle compile without being checked.
 */
export class FunctionTypedArgsInheritedUncheckedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Inherited Unchecked - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave unchecked the calls it cannot resolve to a constructor";
}
