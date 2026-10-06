import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionMapSetTest
 * @description Validates that `Mapa|Conjunto` and `tiene` is emitted as `has`, not as the `includes` of the first class by name.
 */
export class FunctionTypedUnionMapSetTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Map Set - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call has directly on a Mapa|Conjunto receiver";
}
