import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionVariableTest
 * @description Validates that a local variable named like a core library function wins over it at the call.
 */
export class UserShadowsCorelibFunctionVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call a variable named esperar instead of the core library function";
}
