import { Test } from "../../../Test";

/**
 * @class EmbedColorUnknownTest
 * @description Validates that it has to reject a color name that is not one of the embed colors.
 */
export class EmbedColorUnknownTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Embed Color Unknown - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a color name that is not one of the embed colors";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Color de embed desconocido: 'noexiste'. Se admite: Aqua / Azul";
}
