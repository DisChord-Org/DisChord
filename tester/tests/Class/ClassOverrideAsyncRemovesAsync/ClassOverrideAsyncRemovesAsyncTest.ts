import { Test } from "../../../Test";

/**
 * @class ClassOverrideAsyncRemovesAsyncTest
 * @description Validates that an override cannot be sync when the method it overrides is async.
 */
export class ClassOverrideAsyncRemovesAsyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassOverrideAsync Removes Async - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a sync override of an async method";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El método 'm' de 'B' no es asíncrono pero el de 'A' sí";
}
