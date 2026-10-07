import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionBeforeTest
 * @description Validates that a function of the file named like a core library function (`esperar`), declared before the call, is the one called.
 */
export class UserShadowsCorelibFunctionBeforeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction Before - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call the user esperar and not import the runtime helper";
}
