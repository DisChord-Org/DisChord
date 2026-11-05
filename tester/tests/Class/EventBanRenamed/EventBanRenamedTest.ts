import { Test } from "../../../Test";

/**
 * @class EventBanRenamedTest
 * @description It has to say that the event ban is now called usuarioBaneado
 */
export class EventBanRenamedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Ban Renamed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to say that the event ban is now called usuarioBaneado";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El evento 'ban' ahora se llama 'usuarioBaneado'.";
}
