import { Test } from "../../../Test";

/**
 * @class FunctionUntypedDispatchLimpiarTest
 * @description Validates that `limpiar` on an unannotated parameter is emitted through `chordLimpiar`: it trims a texto and clears a Mapa or a Conjunto.
 */
export class FunctionUntypedDispatchLimpiarTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Untyped Dispatch Limpiar - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch limpiar at run time on an untyped receiver";
}
