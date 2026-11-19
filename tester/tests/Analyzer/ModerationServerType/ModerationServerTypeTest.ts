import { Test } from "../../../Test";

/**
 * @class ModerationServerTypeTest
 * @description Validates that it has to reject a number as the server of a moderation action.
 */
export class ModerationServerTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Server Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the server of a moderation action";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'banear miembro' espera un valor de tipo 'bdo|texto' en 'servidor', se recibió 'numero'";
}
