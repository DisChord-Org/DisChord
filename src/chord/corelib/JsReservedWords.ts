/**
 * The words JavaScript does not let a program use as a name: the reserved words of the language, the
 * ones strict mode adds (modules are always strict), `await`, which a module reserves, and `eval` and
 * `arguments`, which strict mode does not let be declared. A declaration named like one is a
 * SyntaxError once the code is compiled, so the analyzer rejects it. A member of a class may carry
 * such a name (a method called `class` is valid JavaScript); the rules that use this decide where it applies.
 * @class JsReservedWords
 */
export class JsReservedWords {
    private static readonly names: ReadonlySet<string> = new Set([
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else',
        'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
        'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void',
        'while', 'with', 'yield',
        // reserved in strict mode
        'let', 'static', 'implements', 'interface', 'package', 'private', 'protected', 'public',
        // reserved in modules
        'await',
        // not reserved, but strict mode does not let them be declared
        'eval', 'arguments'
    ]);

    /**
     * @param {string} name - A name as written in source code.
     * @returns {boolean} Whether JavaScript does not let it be declared.
     */
    public static has (name: string): boolean {
        return JsReservedWords.names.has(name);
    }
}
