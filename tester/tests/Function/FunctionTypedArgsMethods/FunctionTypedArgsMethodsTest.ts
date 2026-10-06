import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsMethodsTest
 * @description Validates that arguments are checked through a receiver typed with a class of the file, through `esta` and for a constructor.
 */
export class FunctionTypedArgsMethodsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Args Methods - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept correct arguments to a method, through esta and to a constructor";
}
