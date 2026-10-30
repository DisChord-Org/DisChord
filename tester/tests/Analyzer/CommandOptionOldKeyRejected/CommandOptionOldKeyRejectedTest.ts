import { Test } from "../../../Test";

/**
 * @class CommandOptionOldKeyRejectedTest
 * @description Validates that the type of a command option is written `tipo`: the former name, `opcion`, is no longer accepted and is reported as a property the option does not take.
 */
export class CommandOptionOldKeyRejectedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option Old Key Rejected - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject opcion as the type of a command option";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'opcion' no admite 'opcion'";
}
