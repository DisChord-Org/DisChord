/**
 * A module the compiler writes once to `dist/` and the compiled files import (the console override, the
 * runtime helpers, ...): where it goes and what it holds, kept together so a rule can't pair one with
 * the content of another.
 */
export interface SharedModule {
    /** Path, relative to the project's `dist` directory, where `CompileCommand` writes the module. */
    readonly path: string;
    /** The module's JavaScript source. */
    readonly content: string;
}
