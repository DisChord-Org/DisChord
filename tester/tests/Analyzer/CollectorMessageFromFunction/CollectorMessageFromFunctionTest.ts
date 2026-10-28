import { Test } from "../../../Test";

/**
 * @class CollectorMessageFromFunctionTest
 * @description Validates that a collector over a message that does not come from a plain message block is not checked.
 */
export class CollectorMessageFromFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Message From Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave unchecked a message produced elsewhere";
}
