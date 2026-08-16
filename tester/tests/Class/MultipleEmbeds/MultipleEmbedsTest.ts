import { Test } from "../../../Test";

/**
 * @class MultipleEmbedsTest
 * @description Validates that a message can send more than one embed at once — mixing inline
 * anonymous embeds and a reference to a previously declared one in the same list.
 */
export class MultipleEmbedsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Multiple Embeds - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to send more than one embed in the same message, mixing inline and referenced embeds';
}
