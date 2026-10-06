import { Test } from "../../../Test";

/**
 * @class FunctionTypedAnnotationLaterClassTest
 * @description Validates that a parameter may name a class declared further down the file.
 */
export class FunctionTypedAnnotationLaterClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Annotation Later Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a parameter typed with a class declared later";
}
