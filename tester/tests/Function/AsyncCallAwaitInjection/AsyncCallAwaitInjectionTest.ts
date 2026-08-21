import { Test } from "../../../Test";

/**
 * @class AsyncCallAwaitInjectionTest
 * @description Regression test for a real bug: `BindDeclarationsRule` registered a `@asincrono`
 * function into the `SymbolTable` without its `metadata.isAsync` flag, so `CallVisitor`'s
 * `symbol?.metadata.isAsync` check — the mechanism that auto-inserts `await` on a call to a known
 * async function — could never fire. A call to an async function compiled to a bare call
 * expression, silently handing back an unresolved `Promise` instead of its value. Fixed by
 * passing `metadata: { isAsync: functionNode.metadata.isAsync }` through to `register()`.
 */
export class AsyncCallAwaitInjectionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Async Call Await Injection - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to auto-insert 'await' when calling a function declared '@asincrono', not leave the call returning an unresolved Promise";
}
