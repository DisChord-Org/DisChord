import { Test } from "../../../Test";

/**
 * @class VariableCoreLibRuntimeTest
 * @description Validates that `esperar`, `Aleatorio.*` and `Mates.limitar` compile, are typed by their declared return type, and make the generated file import the runtime helpers module with only the helpers it uses.
 */
export class VariableCoreLibRuntimeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Runtime - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile the runtime helpers and import only the ones the file uses";
}
