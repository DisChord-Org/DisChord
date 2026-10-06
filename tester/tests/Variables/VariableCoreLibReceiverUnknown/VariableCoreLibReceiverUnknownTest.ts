import { Test } from "../../../Test";

/**
 * @class VariableCoreLibReceiverUnknownTest
 * @description Validates that a member read on a receiver whose type belongs to no core library class (`booleano`) is left untyped rather than guessed from a same-named member of another class, so the annotation is not contradicted.
 */
export class VariableCoreLibReceiverUnknownTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Receiver Unknown - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a member untyped when the receiver's type belongs to no core library class";

}
