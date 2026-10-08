import { Test } from "../../../Test";

/**
 * @class MemberAccessMapTypedTest
 * @description Pins how members of a typed Mapa receiver are emitted.
 */
export class MemberAccessMapTypedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Map Typed - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit Mapa members as Map members";
}
