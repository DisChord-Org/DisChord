import { Test } from "../../../Test";

/**
 * @class TypedUserArgumentOkTest
 * @description It has to accept the user of an event where a function expects a user
 */
export class TypedUserArgumentOkTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Typed User Argument Ok - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the user of an event where a function expects a user";
}
