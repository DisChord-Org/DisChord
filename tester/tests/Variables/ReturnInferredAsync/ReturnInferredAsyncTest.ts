import { Test } from "../../../Test";

/**
 * @class ReturnInferredAsyncTest
 * @description Validates that the inferred type of an async function is the type of the value it resolves to, not a promise.
 */
export class ReturnInferredAsyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred Async - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer the value type of an async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se le asignó un valor de tipo 'texto'";
}
