import { Test } from "../../../Test";

/**
 * @class UntypedLongitudTypedUnchangedTest
 * @description Validates that a receiver of known type keeps reading `length` directly.
 */
export class UntypedLongitudTypedUnchangedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Longitud Typed Unchanged - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave longitud on a typed receiver as length";
}
