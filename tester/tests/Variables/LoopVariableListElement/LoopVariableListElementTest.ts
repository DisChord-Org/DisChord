import { Test } from "../../../Test";

/**
 * @class LoopVariableListElementTest
 * @description Validates that the variable of a `para` over a list has the type of its elements, so a member is picked through that class (`Mapa.tiene` is `has`).
 */
export class LoopVariableListElementTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Loop Variable List Element - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type the variable of a loop after the elements of the list";
}
