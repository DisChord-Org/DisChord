import { Test } from "../../../Test";

/**
 * @class IndexAccessTupleDynamicTest
 * @description Validates that indexing a tuple with a variable gives no type, so the member is resolved by name or at run time.
 */
export class IndexAccessTupleDynamicTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Access Tuple Dynamic - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave an element of a tuple indexed dynamically untyped";
}
