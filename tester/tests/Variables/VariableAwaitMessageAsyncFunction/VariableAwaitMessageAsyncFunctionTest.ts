import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageAsyncFunctionTest
 * @description Validates that `enviar mensaje` inside an `@asincrono` function is rejected even though the function may await: it has no `ctx`.
 */
export class VariableAwaitMessageAsyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message Async Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject 'enviar mensaje' inside an async function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "solo puede usarse dentro de un comando o un evento";
}
