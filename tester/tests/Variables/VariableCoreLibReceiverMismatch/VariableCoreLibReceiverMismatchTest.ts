import { Test } from "../../../Test";

/**
 * @class VariableCoreLibReceiverMismatchTest
 * @description Validates that a member shared by several classes with different return types
 * (`cortar` is `texto` on `Texto` and a list on `Lista`) is typed after the receiver's class, so a
 * `tipo` annotation contradicting it is rejected instead of the ambiguity leaving it unchecked.
 */
export class VariableCoreLibReceiverMismatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Receiver Mismatch - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an annotation contradicting a member shared by several classes, typed after the receiver's class";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "se declaró con tipo 'numero' pero se le asignó un valor de tipo 'texto'";
}
