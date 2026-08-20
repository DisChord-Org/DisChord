import { Test } from "../../../Test";

/**
 * @class BDOCallbackReferenceTest
 * @description Validates that a BDO property can take a previously-declared `funcion` as its
 * value by bare reference (`memear bruh`, no parentheses), and that calling the resulting
 * member (`bdo.memear()`) invokes that function — the mechanism the collector redesign relies
 * on to accept named callbacks instead of inline code blocks.
 */
export class BDOCallbackReferenceTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Callback Reference - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to store a function reference as a BDO property's value and invoke it through the member call";
}
