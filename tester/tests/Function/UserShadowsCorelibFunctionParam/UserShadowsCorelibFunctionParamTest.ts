import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionParamTest
 * @description Validates that a parameter named like a core library function wins over it inside the function, while outside it the helper is still used.
 */
export class UserShadowsCorelibFunctionParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call a parameter named esperar inside its function and the helper outside";
}
