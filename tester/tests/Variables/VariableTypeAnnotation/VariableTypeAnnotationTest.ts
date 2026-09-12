import { Test } from "../../../Test";

/**
 * @class VariableTypeAnnotationTest
 * @description Validates that `var <id> tipo <nombre> es <expr>` compiles identically to the
 * untyped form (the annotation is compile-time only and erased at generation), and that a
 * variable declared without `tipo` still works exactly as before.
 */
export class VariableTypeAnnotationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Type Annotation - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'var <id> tipo <nombre> es <expr>' the same as the untyped form, erasing the annotation entirely";
}
