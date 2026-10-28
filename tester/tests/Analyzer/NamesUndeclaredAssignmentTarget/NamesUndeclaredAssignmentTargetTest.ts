import { Test } from "../../../Test";

/**
 * @class NamesUndeclaredAssignmentTargetTest
 * @description Validates that assigning to a name that is declared nowhere is rejected.
 */
export class NamesUndeclaredAssignmentTargetTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Names Undeclared Assignment Target - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject an undeclared name as the target of an assignment";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'nadie' no está declarado.";
}
