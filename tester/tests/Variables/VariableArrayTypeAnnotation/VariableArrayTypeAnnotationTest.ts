import { Test } from "../../../Test";

/**
 * @class VariableArrayTypeAnnotationTest
 * @description Validates that `var <id> tipo <nombre>[] es [ ... ]` compiles identically to the
 * untyped form (the annotation is compile-time only and erased at generation), and that a
 * homogeneous list literal without an explicit annotation still gets its array type inferred
 * (`ResolveVariableTypesRule.inferArrayElementType`) into the `SymbolTable`.
 */
export class VariableArrayTypeAnnotationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Array Type Annotation - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'var <id> tipo <nombre>[] es [ ... ]' the same as the untyped form, and infer the array type when no annotation is written";
}
