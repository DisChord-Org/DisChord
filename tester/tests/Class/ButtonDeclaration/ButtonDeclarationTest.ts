import { Test } from "../../../Test";

/**
 * @class ButtonDeclarationTest
 * @description Validates that a named, reusable button (`nuevo boton <Nombre> { ... }`) can be
 * declared and then referenced by its bare name from a message's `boton` property.
 */
export class ButtonDeclarationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Button Declaration - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to declare a reusable named button and reference it by name inside a message';
}
