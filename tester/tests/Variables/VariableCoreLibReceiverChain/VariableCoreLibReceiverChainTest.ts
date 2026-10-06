import { Test } from "../../../Test";

/**
 * @class VariableCoreLibReceiverChainTest
 * @description Validates that the receiver's type is inferred through a chain of calls: `"a,b".partir(",")` is a list, so `.longitud` on it is a `numero` and contradicts a `texto` annotation.
 */
export class VariableCoreLibReceiverChainTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Receiver Chain - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to infer the type of a chained core library access from the type each previous link produces";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'texto' pero se le asignó un valor de tipo 'numero'";
}
