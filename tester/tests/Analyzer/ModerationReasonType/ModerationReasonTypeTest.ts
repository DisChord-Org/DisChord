import { Test } from "../../../Test";

/**
 * @class ModerationReasonTypeTest
 * @description Validates that it has to reject a number as the reason of a moderation action.
 */
export class ModerationReasonTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Reason Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a number as the reason of a moderation action";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'banear miembro' espera un valor de tipo 'texto' en 'razon', se recibió 'numero'";
}
