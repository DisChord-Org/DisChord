import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageListaTest
 * @description Validates that variables initialized from `Lista` methods and `longitud` and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageListaTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Lista - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `Lista` methods and `longitud` annotated with the matching return type";
}
