import { Test } from "../../../Test";

/**
 * @class ChannelGetBothIdAndNameTest
 * @description It has to reject obtener canal given both an id and a nombre
 */
export class ChannelGetBothIdAndNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get Both Id And Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject obtener canal given both an id and a nombre";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'obtener canal' no se pueden dar 'id' y 'nombre' a la vez.";
}
