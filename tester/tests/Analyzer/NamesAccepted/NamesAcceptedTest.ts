import { Test } from "../../../Test";

/**
 * @class NamesAcceptedTest
 * @description Validates that every name that is declared or provided resolves: a function used before it is declared, recursion, a parameter, the variable of a loop and the keys of an intelligent block inside their bodies, shadowing, the core library, a JavaScript global and a method called through `esta`.
 */
export class NamesAcceptedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Accepted - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept every name that is declared, provided by the library or a JavaScript global";
}
