import { Test } from "../../../Test";

/**
 * @class BDOGroupedPropertiesTest
 * @description Validates that an empty line followed by another property does not start the code: properties may be grouped, and the block stays a plain object.
 */
export class BDOGroupedPropertiesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Grouped Properties - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to keep a property after an empty line as a property';
}
