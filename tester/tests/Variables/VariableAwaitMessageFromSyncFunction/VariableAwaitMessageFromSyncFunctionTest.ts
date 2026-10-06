import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageFromSyncFunctionTest
 * @description Validates that `enviar mensaje` inside a function that is not `@asincrono` is rejected, since it is emitted as an `await`.
 */
export class VariableAwaitMessageFromSyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message From Sync Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject 'enviar mensaje' inside a non-async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'enviar mensaje' espera una respuesta";
}
