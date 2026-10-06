import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionImportOrderTest
 * @description Validates that the helpers a file uses are imported once, in order, together with the other runtime helpers.
 */
export class FunctionTypedUnionImportOrderTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Import Order - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to import every used runtime helper once, sorted";
}
