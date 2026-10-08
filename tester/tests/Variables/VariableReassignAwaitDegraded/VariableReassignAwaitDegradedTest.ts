import { Test } from "../../../Test";

/**
 * @class VariableReassignAwaitDegradedTest
 * @description Validates that a variable reassigned to a value that is not an instance of its class resolves its async method by name, like a receiver of unknown type.
 */
export class VariableReassignAwaitDegradedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'VariableReassign Await Degraded - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to not await a method declared sync by one of the classes after a reassignment";
}
