import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageClasesTest
 * @description Validates that variables initialized from `Mapa`, `Conjunto` and `Expresion` instance members and annotated with the declared return type compile.
 */
export class VariableCoreLibCoverageClasesTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Clases - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile variables initialized from `Mapa`, `Conjunto` and `Expresion` instance members annotated with the matching return type";
}
