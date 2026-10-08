import { Test } from "../../../Test";

/**
 * @class VariableTypeUnknownMessageVariableTest
 * @description Validates that the message for an unknown type in a variable annotation lists every valid type, taken from the real tables.
 */
export class VariableTypeUnknownMessageVariableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Type Unknown Message Variable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to list the valid types when a variable is annotated with an unknown one";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "Tipo desconocido 'Mates'. Tipos válidos: texto, numero, booleano, bdo, indefinido, cualquiera, Lista, Mapa, Conjunto, Promesa, Expresion, Fecha o una clase declarada en el archivo; también T[], [A, B] y A|B";
}
