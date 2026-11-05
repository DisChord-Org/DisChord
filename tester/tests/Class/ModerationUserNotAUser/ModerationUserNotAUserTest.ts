import { Test } from "../../../Test";

/**
 * @class ModerationUserNotAUserTest
 * @description It has to throw when the usuario of a moderation block is a number
 */
export class ModerationUserNotAUserTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation User Not A User - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to throw when the usuario of a moderation block is a number";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "debe ser un usuario, un texto con su identificador o una promesa de uno";
}
