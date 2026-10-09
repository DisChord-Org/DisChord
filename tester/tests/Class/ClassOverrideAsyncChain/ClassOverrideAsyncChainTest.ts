import { Test } from "../../../Test";

/**
 * @class ClassOverrideAsyncChainTest
 * @description Validates that an override is compared with the nearest ancestor that declares the method, however far up.
 */
export class ClassOverrideAsyncChainTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'ClassOverrideAsync Chain - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compare an override with a method declared two classes up";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El método 'm' de 'C' es asíncrono pero el de 'A' no";
}
