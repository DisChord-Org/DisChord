import { Test } from "../../../Test";

/**
 * @class BareBDOStatementTest
 * @description Regression test for a real bug in `Generator`: a Simple-mode BDO used as a bare
 * statement (not assigned, not a property value — e.g. `{ bdoC [] }` on its own line) used to
 * generate unparenthesized `{ bdoC: [] };`, which JavaScript parses as a block statement
 * containing a `bdoC:` labeled expression, not an object literal — silently discarding `bdoC`
 * with no error. Fixed by `Generator.visitStatement`, which wraps a Simple-mode BDO in parens
 * whenever it's visited in statement position, mirroring the idiomatic `({ ... })` JS uses to
 * force object-literal parsing at statement level.
 */
export class BareBDOStatementTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Bare BDO Statement - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to parenthesize a Simple-mode BDO used as a bare statement, instead of letting it collapse into a JS block";
}
