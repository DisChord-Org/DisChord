import { Test } from "../../../Test";

/**
 * @class UntypedLongitudWriteUnchangedTest
 * @description Validates that assigning to `longitud` on a receiver of unknown type is still emitted as written.
 */
export class UntypedLongitudWriteUnchangedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Longitud Write Unchanged - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave an assignment to longitud on an untyped receiver unchanged";
}
