import { Test } from "../../../Test";

/**
 * @class CallStatementInNestedBDOTest
 * @description Regression test for a real bug found in `BDOParser.checkPropertyPattern`: a bare
 * call statement with no trailing ';' (e.g. `consola.imprimir("mensaje")`) nested a few levels
 * deep inside plain BDO property blocks used to be silently swallowed as if it were itself a
 * property, instead of executing — because `identifier(` looked identical to a property whose
 * value happens to be parenthesized (e.g. `denji ("..." + makima);`, see `BDO/IntelligentBDO`).
 * The fix disambiguates the two using the same ';'-lookahead signal the parser already relies on
 * elsewhere, instead of assuming every bare identifier is a property.
 */
export class CallStatementInNestedBDOTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Call Statement In Nested BDO - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to execute a bare call statement nested inside plain BDO property blocks, not swallow it as a property";
}
