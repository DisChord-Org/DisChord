import { Test } from "../../../Test";

/**
 * @class KnownMemberOpenClassesTest
 * @description Validates that it has to leave the members of cliente, contexto and the objects of Seyfert unchecked.
 */
export class KnownMemberOpenClassesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Member Open Classes - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave the members of cliente, contexto and the objects of Seyfert unchecked";
}
