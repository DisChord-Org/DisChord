import { Test } from "../../../Test";

/**
 * @class VariableCoreLibRuntimeSinHelpersTest
 * @description Validates that a file using no runtime helper gets no import of the runtime helpers module, even when it uses other `Mates` members and a user-defined `limitar`.
 */
export class VariableCoreLibRuntimeSinHelpersTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Runtime Sin Helpers - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave a file that uses no runtime helper without the helpers import";
}
