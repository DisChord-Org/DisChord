import { Test } from "../../../Test";

/**
 * @class VariableAwaitMessageAsyncFunctionTest
 * @description Validates that `enviar mensaje` inside an `@asincrono` function compiles.
 */
export class VariableAwaitMessageAsyncFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Message Async Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'enviar mensaje' inside an async function";
}
