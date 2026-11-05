import { Test } from "../../../Test";

/**
 * @class EventUnbanRenamedTest
 * @description It has to say that the event unban is now called usuarioDesbaneado
 */
export class EventUnbanRenamedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Event Unban Renamed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to say that the event unban is now called usuarioDesbaneado";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El evento 'unban' ahora se llama 'usuarioDesbaneado'.";
}
