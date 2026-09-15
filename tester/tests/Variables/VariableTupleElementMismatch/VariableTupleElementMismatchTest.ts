import { Test } from "../../../Test";

/**
 * @class VariableTupleElementMismatchTest
 * @description Validates that `tipo [texto, numero]` rejects a list literal with the right length
 * but a wrong type at a given position — position 0 must be `texto`, but the list assigns it a
 * `numero`.
 */
export class VariableTupleElementMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Tuple Element Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a tuple-typed variable when an element's type doesn't match its declared position";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "el elemento 0 es de tipo 'numero', se esperaba 'texto'";
}
