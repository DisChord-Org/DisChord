import { Test } from "../../../Test";

/**
 * @class ClassOverrideAsyncAddsAsyncTest
 * @description Validates that an override cannot be async when the method it overrides is not.
 */
export class ClassOverrideAsyncAddsAsyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassOverrideAsync Adds Async - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an async override of a sync method";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El método 'm' de 'B' es asíncrono pero el de 'A' no";
}
