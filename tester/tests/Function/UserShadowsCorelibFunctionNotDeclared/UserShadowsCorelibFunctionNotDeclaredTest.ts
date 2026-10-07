import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionNotDeclaredTest
 * @description Validates the contrast: without a declaration of the user, `esperar` is still the runtime helper, awaited and imported.
 */
export class UserShadowsCorelibFunctionNotDeclaredTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction Not Declared - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep esperar as the runtime helper when the file declares none";
}
