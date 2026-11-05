import { Test } from "../../../Test";

/**
 * @class ModerationBanSecondsOutOfRangeTest
 * @description It has to throw when borrarMensajes is past seven days
 */
export class ModerationBanSecondsOutOfRangeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Ban Seconds Out Of Range - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when borrarMensajes is past seven days";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'borrarMensajes' son los segundos de mensajes a borrar";
}
