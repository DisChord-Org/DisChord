import { Test } from "../../../Test";

/**
 * @class CommandInsideFunctionTest
 * @description It has to reject a command declared inside a function
 */
export class CommandInsideFunctionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Inside Function - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a command declared inside a function";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'comando' solo puede declararse en el nivel superior del archivo";
}
