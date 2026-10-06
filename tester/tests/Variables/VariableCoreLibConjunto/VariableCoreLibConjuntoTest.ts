import { Test } from "../../../Test";

/**
 * @class VariableCoreLibConjuntoTest
 * @description Validates that `Conjunto` members annotated with their declared return type compile and are emitted as the Set members they map to.
 */
export class VariableCoreLibConjuntoTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Conjunto - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit add, has, delete, clear and size for a typed Conjunto";
}
