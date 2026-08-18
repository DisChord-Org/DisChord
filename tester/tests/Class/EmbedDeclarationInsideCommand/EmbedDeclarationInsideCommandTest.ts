import { Test } from "../../../Test";

/**
 * @class EmbedDeclarationInsideCommandTest
 * @description Regression test for a real bug: `nuevo embed X {}` written inside a command's
 * body (or any nested statement position — a loop, a condition, a function body, an `exportar`)
 * never got bound to a reusable `X` variable, unlike the exact same syntax at the top level of a
 * file. Root cause: `DisChordStatementParser` (the only place `bindReusableName` was applied)
 * is only reached via the polymorphic `Parser.parseStatement()` hook — but `BDOParser`,
 * `BlockParser` and `ExportParser` all called `this.parent.get(StatementParser).parse()`
 * directly, bypassing that hook and silently falling back to native Chord statement parsing
 * (which parses `nuevo embed X {}` as an anonymous, unbound expression via `PrimaryParser`).
 * Fixed by having those three call `this.parent.parseStatement()` instead, so DisChord's
 * override applies everywhere a statement is parsed, not just at the top level.
 */
export class EmbedDeclarationInsideCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Declaration Inside Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to bind 'nuevo embed X {}' to a reusable 'X' variable even when nested inside a command's body, not just at the top level";
}
