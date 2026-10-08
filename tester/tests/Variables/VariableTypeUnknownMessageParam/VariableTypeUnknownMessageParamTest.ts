import { Test } from "../../../Test";

/**
 * @class VariableTypeUnknownMessageParamTest
 * @description Validates that the same message is given for an unknown type in a parameter.
 */
export class VariableTypeUnknownMessageParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Type Unknown Message Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to list the valid types when a parameter is annotated with an unknown one";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'Mates'. Tipos válidos: texto, numero, booleano, bdo, indefinido, cualquiera, Lista, Mapa, Conjunto, Promesa, Expresion, Fecha o una clase declarada en el archivo; también T[], [A, B] y A|B";
}
