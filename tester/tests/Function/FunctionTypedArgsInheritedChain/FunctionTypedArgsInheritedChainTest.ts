import { Test } from "../../../Test";

/**
 * @class FunctionTypedArgsInheritedChainTest
 * @description Validates that the nearest constructor up a chain of three classes is the one checked.
 */
export class FunctionTypedArgsInheritedChainTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'FunctionTypedArgs Inherited Chain - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to check against the constructor declared two classes up";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El argumento 1 de 'C' es de tipo 'texto', se esperaba 'numero'";
}
