import { Test } from "../../../Test";

/**
 * @class VariableTypeUnknownMessageReturnTest
 * @description Validates that the same message is given for an unknown type in a return type.
 */
export class VariableTypeUnknownMessageReturnTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Type Unknown Message Return - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to list the valid types when a return type is an unknown one";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'Mates'. Tipos válidos: texto, numero, booleano, bdo, indefinido, cualquiera, Lista, Mapa, Conjunto, Promesa, Expresion, Fecha o una clase declarada en el archivo; también T[], [A, B] y A|B";
}
