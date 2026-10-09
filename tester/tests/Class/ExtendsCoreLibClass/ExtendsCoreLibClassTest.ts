import { Test } from "../../../Test";

/**
 * @class ExtendsCoreLibClassTest
 * @description Validates that a class extending a core library class extends its JavaScript constructor (`Mapa` is `Map`), while a class of the file with that name is still the one extended.
 */
export class ExtendsCoreLibClassTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Extends Core Lib Class - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit the JavaScript constructor for a core library parent class";
}
