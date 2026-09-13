import { Test } from "../../../Test";

/**
 * @class VariableUnionArrayMismatchTest
 * @description Validates that `tipo (texto|numero)[]` still rejects a list containing an element
 * type outside the declared union (`booleano`, here) — the "inferred type must be a subset of the
 * declared union" check in `ResolveVariableTypesRule.isCompatible` catches a kind the annotation
 * never named, not just a kind mismatch on a scalar.
 */
export class VariableUnionArrayMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Array Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a union array annotation when the list contains an element type outside the declared union";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero|texto[]' pero se le asignó un valor de tipo 'booleano|numero[]'";
}
