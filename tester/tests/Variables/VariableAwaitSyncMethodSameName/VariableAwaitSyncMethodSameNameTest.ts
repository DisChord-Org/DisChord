import { Test } from "../../../Test";

/**
 * @class VariableAwaitSyncMethodSameNameTest
 * @description Validates that a method called through an instance is never mistaken for a global async function of the same name.
 */
export class VariableAwaitSyncMethodSameNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Sync Method Same Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a sync method call without await even when an async global function shares its name";
}
