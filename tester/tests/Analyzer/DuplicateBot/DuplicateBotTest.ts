import { Test } from "../../../Test";

/**
 * @class DuplicateBotTest
 * @description Validates that a second `encender bot { ... }` block in the same file throws,
 * now via `BindDisChordDeclarationsRule` (Analyzer's "Variables" pass) instead of the
 * `try/catch` around `SymbolTable.register` that used to live in `ClientParser`.
 */
export class DuplicateBotTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Duplicate Bot Declaration - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when 'encender bot' is declared more than once in the same file";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Ya existe una declaración 'encender bot'";
}
