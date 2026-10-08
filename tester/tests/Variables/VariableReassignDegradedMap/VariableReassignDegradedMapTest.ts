import { Test } from "../../../Test";

/**
 * @class VariableReassignDegradedMapTest
 * @description Validates that a variable reassigned to another type becomes cualquiera, so its members are resolved at run time.
 */
export class VariableReassignDegradedMapTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Degraded Map - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch tiene on a Mapa variable reassigned to a texto";
}
