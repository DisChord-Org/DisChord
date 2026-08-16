import { Test } from "../../../Test";

/**
 * @class DuplicateVariableTest
 * @description Validates that declaring the same variable name twice in the same scope throws a
 * duplicate-identifier error, now thrown by `BindDeclarationsRule` (Analyzer's "Variables" pass)
 * instead of `VariableParser` at parse time.
 */
export class DuplicateVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Duplicate Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to throw when the same variable name is declared twice in the same scope';

    /**
     * @type {string}
     */
    public readonly expectedError: string = 'Identificador duplicado';
}
