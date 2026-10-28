/**
 * The JavaScript globals a program may name without declaring them, because the code it is compiled to
 * runs where they exist (Node): the built-in objects and functions of the language, and the ones of
 * the runtime (`console`, `process`, timers...). A curated list, not whatever `globalThis` has: a name
 * outside it is reported as undeclared.
 * @class JsGlobals
 */
export class JsGlobals {
    private static readonly names: ReadonlySet<string> = new Set([
        // values and functions of the language
        'undefined', 'NaN', 'Infinity', 'globalThis', 'parseInt', 'parseFloat', 'isNaN', 'isFinite',
        'encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent', 'structuredClone', 'queueMicrotask',
        // built-in objects
        'Object', 'Array', 'String', 'Number', 'Boolean', 'BigInt', 'Symbol', 'Math', 'Date', 'RegExp', 'JSON', 'Intl',
        'Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef', 'Promise', 'Reflect', 'Proxy',
        'Error', 'TypeError', 'RangeError', 'SyntaxError', 'ReferenceError', 'EvalError', 'URIError', 'AggregateError',
        'ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Atomics',
        'Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array',
        'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array',
        // runtime
        'console', 'process', 'Buffer', 'performance', 'crypto', 'fetch', 'Headers', 'Request', 'Response', 'FormData', 'Blob',
        'URL', 'URLSearchParams', 'AbortController', 'AbortSignal', 'TextEncoder', 'TextDecoder', 'EventTarget', 'Event',
        'setTimeout', 'setInterval', 'setImmediate', 'clearTimeout', 'clearInterval', 'clearImmediate'
    ]);

    /**
     * @param {string} name - A name as written in source code.
     * @returns {boolean} Whether it is one of the JavaScript globals a program may use.
     */
    public static has (name: string): boolean {
        return JsGlobals.names.has(name);
    }
}
