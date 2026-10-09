import { Test } from "../../../Test";

/**
 * @class IndexAccessArrayClassTest
 * @description Validates that indexing a typed list of a core library class gives the element type, so its members resolve through that class.
 */
export class IndexAccessArrayClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Index Access Array Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit Map members on an element of a Mapa list";
}
