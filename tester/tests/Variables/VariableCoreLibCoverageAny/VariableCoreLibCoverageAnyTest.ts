import { Test } from "../../../Test";

/**
 * @class VariableCoreLibCoverageAnyTest
 * @description Validates that members whose return type is `cualquiera` (`JSON.leer`, `Lista.quitarUltimo`, `Lista.encontrar`, `Texto.coincidir`) are accepted with any annotation.
 */
export class VariableCoreLibCoverageAnyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Core Lib Coverage Any - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile any annotation over a core library member returning an unknown type";
}
