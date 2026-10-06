import { Test } from "../../../Test";

/**
 * @class VariableUnicodeIdentifierTest
 * @description Validates that identifiers may contain non-ASCII letters (`año`, `canción`, `ñu`), as variables, functions, class methods and core library members, and are emitted unchanged.
 */
export class VariableUnicodeIdentifierTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Unicode Identifier - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile identifiers with non-ASCII letters keeping their names";
}
