import { Test } from "../../../Test";

/**
 * @class KnownMemberSuggestionTest
 * @description Validates that it has to suggest the member of the class closest to the unknown one.
 */
export class KnownMemberSuggestionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Member Suggestion - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to suggest the member of the class closest to the unknown one";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "¿Querías decir 'longitud'?";
}
