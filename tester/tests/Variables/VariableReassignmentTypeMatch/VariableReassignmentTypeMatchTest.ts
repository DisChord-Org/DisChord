import { Test } from "../../../Test";

/**
 * @class VariableReassignmentTypeMatchTest
 * @description Regression guard for `ValidateAssignmentTypesRule`: reassigning a typed variable to
 * a value whose type matches its declared `tipo` must keep compiling exactly like the untyped
 * form, unaffected by the new reassignment check.
 */
export class VariableReassignmentTypeMatchTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reassignment Type Match - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a reassignment whose value's type matches the variable's declared type, unaffected by the new check";
}
