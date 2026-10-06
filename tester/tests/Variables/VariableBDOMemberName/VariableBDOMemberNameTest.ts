import { Test } from "../../../Test";

/**
 * @class VariableBDOMemberNameTest
 * @description Validates that a field of a simple BDO that is named like a core library member (`longitud`) is emitted as written, while the same name on a list still becomes `length`: the receiver's type decides, not the name alone.
 */
export class VariableBDOMemberNameTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable BDO Member Name - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit a BDO's own field as written and a list's core library member under its JavaScript name";
}
