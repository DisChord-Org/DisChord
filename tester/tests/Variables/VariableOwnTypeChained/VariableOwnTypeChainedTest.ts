import { Test } from "../../../Test";

/**
 * @class VariableOwnTypeChainedTest
 * @description Validates that `Mapa.poner`, `Conjunto.agregar` and `BDO.congelar` are typed after their own collection, so a chained call is typed after that class.
 */
export class VariableOwnTypeChainedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Own Type Chained - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to type chained calls on the collection returned by poner, agregar and congelar";
}
