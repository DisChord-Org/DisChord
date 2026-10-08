import { Test } from "../../../Test";

/**
 * @class VariableReassignStableMapTest
 * @description Validates that a variable reassigned only with the same class keeps resolving its members through it.
 */
export class VariableReassignStableMapTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Stable Map - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit has for a Mapa reassigned to another Mapa";
}
