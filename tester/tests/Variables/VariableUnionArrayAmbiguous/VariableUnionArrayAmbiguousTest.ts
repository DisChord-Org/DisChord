import { Test } from "../../../Test";

/**
 * @class VariableUnionArrayAmbiguousTest
 * @description Validates that `tipo texto|numero[]` (a multi-member union combined with `[]` but
 * without parentheses) is rejected at parse time, since it's genuinely ambiguous whether `[]`
 * binds to just `numero` or to the whole union — the same reason TypeScript itself requires
 * `(string | number)[]` rather than `string | number[]` for this shape.
 */
export class VariableUnionArrayAmbiguousTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Array Ambiguous - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a multi-member union combined with '[]' when it isn't wrapped in parentheses";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "debe ir entre paréntesis";
}
