import { Test } from "../../../Test";

/**
 * @class BDOIOnNestedPropertyTest
 * @description KNOWN LIMITATION, not yet fixed (intentionally deferred — decorators need a
 * broader look later). `@BDOI` only works when the statement that follows it reaches a `{`
 * directly (e.g. `@BDOI` before `var x es {...}`). Placed in front of a *named* nested BDO
 * property (`bdoB { ... }` inside another BDO's body), `checkPropertyPattern` sees the decorator
 * token first (not an IDENTIFICADOR) and falls through to generic statement parsing, which does
 * not know how to reconstruct "decorator + property key + brace" — it parses `bdoB` as an
 * orphaned bare expression and abandons the following `{`, leading to a stray ';' the parser
 * can't recover from. This test pins the current (broken) behavior so a future fix is a
 * deliberate change, not a silent regression.
 */
export class BDOIOnNestedPropertyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDOI Decorator On Nested Property - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It currently crashes when '@BDOI' precedes a named nested BDO property — known limitation, pending a decorator rework";

    /**
     * @type {string}
     */
    public readonly expectedError: string = 'Token inesperado en expresión';
}
