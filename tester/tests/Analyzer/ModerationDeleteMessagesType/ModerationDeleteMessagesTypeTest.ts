import { Test } from "../../../Test";

/**
 * @class ModerationDeleteMessagesTypeTest
 * @description Validates that it has to reject a text as the seconds of messages a ban deletes.
 */
export class ModerationDeleteMessagesTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Delete Messages Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a text as the seconds of messages a ban deletes";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'banear miembro' espera un valor de tipo 'numero' en 'borrarMensajes', se recibió 'texto'";
}
