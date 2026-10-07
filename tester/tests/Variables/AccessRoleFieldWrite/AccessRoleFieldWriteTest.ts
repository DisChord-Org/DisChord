import { Test } from "../../../Test";

/**
 * @class AccessRoleFieldWriteTest
 * @description Validates that assigning to a name the core library knows (`longitud`) on a receiver of unknown type writes a field instead of the core library property.
 */
export class AccessRoleFieldWriteTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Access Role Field Write - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit an assignment to a core library property name untouched on an untyped receiver";
}
