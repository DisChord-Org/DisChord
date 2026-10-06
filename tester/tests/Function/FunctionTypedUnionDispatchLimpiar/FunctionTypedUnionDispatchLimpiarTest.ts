import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionDispatchLimpiarTest
 * @description Validates that `texto|Mapa` and `limpiar` is emitted through the `chordLimpiar` helper.
 */
export class FunctionTypedUnionDispatchLimpiarTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Dispatch Limpiar - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch limpiar at run time on a texto|Mapa receiver";
}
