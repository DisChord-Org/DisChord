import { Test } from "../../../Test";

/**
 * @class ListInferClassInstancesTest
 * @description Validates that a list of instances of a class is inferred as a list of that class.
 */
export class ListInferClassInstancesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ListInferClass Instances - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept a list of instances where a list of its class is expected";
}
