import { Test } from "../../../Test";

/**
 * @class VariableCoreLibReceiverTypeTest
 * @description Validates that a core library member whose name several classes share (`cortar` is both `Texto` and `Lista`, with different return types) is typed after the class of the receiver's own type, instead of being left untyped for being ambiguous.
 */
export class VariableCoreLibReceiverTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Receiver Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type a member shared by several classes after the receiver's class, accepting a matching annotation on both";

}
