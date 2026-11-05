import { Test } from "../../../Test";

/**
 * @class ChannelGetCategoryWithoutNameTest
 * @description It has to reject a categoria in obtener canal that is not searching by nombre
 */
export class ChannelGetCategoryWithoutNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Get Category Without Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a categoria in obtener canal that is not searching by nombre";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "En 'obtener canal', 'categoria' solo se usa junto a 'nombre'.";
}
