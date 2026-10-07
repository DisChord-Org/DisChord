import { Test } from "../../../Test";

/**
 * @class FunctionUntypedDispatchStaticUntouchedTest
 * @description Validates that a static access (`Mapa`) and a call on `esta` are never dispatched.
 */
export class FunctionUntypedDispatchStaticUntouchedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Untyped Dispatch Static Untouched - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not dispatch a static access nor a call on esta";
}
