import { Test } from "../../../Test";

/**
 * @class UserShadowsCorelibFunctionImprimirTest
 * @description Validates that a user function named `imprimir` wins over the dischord `imprimir` (`cliente.logger.info`).
 */
export class UserShadowsCorelibFunctionImprimirTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'UserShadowsCorelibFunction Imprimir - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call the user imprimir instead of the dischord logger";
}
