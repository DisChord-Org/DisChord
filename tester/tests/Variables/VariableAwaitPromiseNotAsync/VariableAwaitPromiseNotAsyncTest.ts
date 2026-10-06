import { Test } from "../../../Test";

/**
 * @class VariableAwaitPromiseNotAsyncTest
 * @description Validates that a core library member that is not async (`Mates.redondear`) is never awaited.
 */
export class VariableAwaitPromiseNotAsyncTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Promise Not Async - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not await a non-async core library member";
}
