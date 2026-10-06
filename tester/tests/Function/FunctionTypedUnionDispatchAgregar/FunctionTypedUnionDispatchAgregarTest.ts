import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionDispatchAgregarTest
 * @description Validates that `Lista|Conjunto` and `agregar` is emitted through the `chordAgregar` helper, with its arguments after the receiver.
 */
export class FunctionTypedUnionDispatchAgregarTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Dispatch Agregar - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch agregar at run time on a Lista|Conjunto receiver";
}
