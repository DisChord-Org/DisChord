import { Test } from "../../../Test";

/**
 * @class NestedBDOChainedAccessTest
 * @description Stress test for BDOs nested two levels deep inside another BDO (via Intelligent
 * mode auto-upgrade, no decorator), followed by a chained member access reaching into that
 * nesting (`mibdo.bdoA.bdoB.bool`). Confirms the IIFE-wrapping the generator uses for BDOs that
 * mix property definitions with executable code composes correctly across nesting levels.
 */
export class NestedBDOChainedAccessTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Nested BDO Chained Access - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve a chained member access through two levels of nested BDO properties";
}
