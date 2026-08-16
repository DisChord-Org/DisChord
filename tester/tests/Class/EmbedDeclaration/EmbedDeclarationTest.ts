import { Test } from "../../../Test";

/**
 * @class EmbedDeclarationTest
 * @description Validates that a named, reusable embed (`nuevo embed <Nombre> { ... }`) can be
 * declared and then referenced by its bare name from a message's `embed` property.
 */
export class EmbedDeclarationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Declaration - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to declare a reusable named embed and reference it by name inside a message';
}
