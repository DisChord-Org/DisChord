import { Test } from "../../../Test";

/**
 * @class FunctionUntypedDispatchUserObjectTest
 * @description Validates that an unannotated receiver that is an object of the file, with its own `tiene`, keeps working through the helper.
 */
export class FunctionUntypedDispatchUserObjectTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Untyped Dispatch User Object - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call the own tiene of an untyped user object";
}
