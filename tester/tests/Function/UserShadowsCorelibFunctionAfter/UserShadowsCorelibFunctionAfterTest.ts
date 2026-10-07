import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionAfterTest
 * @description Validates that the user function wins when it is declared after the call.
 */
export class UserShadowsCorelibFunctionAfterTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction After - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call a user esperar declared later";
}
