import { Test } from "../../../Test";

/**
 * @class VariableAwaitTwoClassesTest
 * @description Validates that two classes declaring the same method name, one async and one not, are each resolved by the type of the receiver.
 */
export class VariableAwaitTwoClassesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Await Two Classes - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to await only the call through the instance of the class whose method is async";
}
