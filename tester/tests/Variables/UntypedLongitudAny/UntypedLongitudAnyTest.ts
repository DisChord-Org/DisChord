import { Test } from "../../../Test";

/**
 * @class UntypedLongitudAnyTest
 * @description Validates that a receiver of type `cualquiera` reads `longitud` through the runtime helper.
 */
export class UntypedLongitudAnyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Untyped Longitud Any - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to read longitud through a receiver of type cualquiera with the helper";
}
