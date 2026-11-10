import { Test } from "../../../Test";

/**
 * @class BanMemberWithoutBlockTest
 * @description It has to point at the stray value after banear miembro instead of asking for a blank line
 */
export class BanMemberWithoutBlockTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Ban Member Without Block - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to point at the stray value after banear miembro instead of asking for a blank line";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Sobra '5': una propiedad se escribe como 'clave valor'";
}
