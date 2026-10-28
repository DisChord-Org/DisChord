import { Test } from "../../../Test";

/**
 * @class NamesSuggestionTest
 * @description Validates that the message suggests a visible name that is one or two edits away.
 */
export class NamesSuggestionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Suggestion - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to suggest the visible name closest to the undeclared one";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "¿Querías decir 'nadie2'?";
}
