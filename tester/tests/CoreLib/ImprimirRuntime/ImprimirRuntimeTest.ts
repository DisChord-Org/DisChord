import { Test } from "../../../Test";
import { corelib } from "../../../../src/dischord/corelib/corelib.data";

/**
 * @class ImprimirRuntimeTest
 * @description Runs the callee `imprimir` is rewritten to: it has to use the logger of the client
 * (as a method call, keeping its `this`) and fall back to `console.log` when there is no client in
 * scope, or the client has no logger.
 */
export class ImprimirRuntimeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Imprimir Runtime - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to choose the logger of the client, or console.log without one';

    /**
     * Not a comparison with a snapshot: it evaluates the callee.
     * @override
     */
    protected override async run (): Promise<void> {
        const callee = corelib.functions['imprimir'];
        const call = new Function('cliente', 'console', `return (${callee})('mensaje');`) as (cliente: unknown, console: unknown) => unknown;

        const consoleCalls: unknown[][] = [];
        const fakeConsole = { log: (...values: unknown[]) => consoleCalls.push(values) };
        const printed = (): number => consoleCalls.length;

        const loggerCalls: { self: unknown; values: unknown[] }[] = [];
        const logger = { info (this: unknown, ...values: unknown[]) { loggerCalls.push({ self: this, values }); } };

        call({ logger }, fakeConsole);
        if (loggerCalls.length !== 1 || loggerCalls[0].self !== logger) throw new Error('With a client, the logger was not called as a method');
        if (printed() !== 0) throw new Error('With a client, console.log was used as well');

        call(undefined, fakeConsole);
        if (printed() !== 1) throw new Error('Without a client, console.log was not used');

        call({}, fakeConsole);
        if (printed() !== 2) throw new Error('With a client that has no logger, console.log was not used');

        // no `cliente` binding at all, as at the top level of a file
        const bare = new Function('console', `return (${callee})('mensaje');`) as (console: unknown) => unknown;
        bare(fakeConsole);
        if (printed() !== 3) throw new Error('With no `cliente` in scope, console.log was not used');
    }
}
