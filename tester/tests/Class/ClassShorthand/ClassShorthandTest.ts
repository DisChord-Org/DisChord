import { Test } from "../../../Test";

/**
 * @class ClassShorthandTest
 * @description Validates that the beginner-friendly shorthand `nuevo <ClaseBase> <Nombre> { ... }`
 * compiles identically to the traditional `clase <Nombre> extiende <ClaseBase> { ... }` form.
 */
export class ClassShorthandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Class Shorthand - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to compile the "nuevo <Base> <Name> {}" shorthand the same way as traditional class inheritance';
}
