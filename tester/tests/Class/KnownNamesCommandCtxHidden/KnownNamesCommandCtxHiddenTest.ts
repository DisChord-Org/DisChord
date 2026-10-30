import { Test } from "../../../Test";

/**
 * @class KnownNamesCommandCtxHiddenTest
 * @description Validates that `ctx`, which the generated code uses for itself, is not a name the command's body can read.
 */
export class KnownNamesCommandCtxHiddenTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Names Command Injected - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject reading ctx inside a command";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'ctx' no está declarado.";
}
