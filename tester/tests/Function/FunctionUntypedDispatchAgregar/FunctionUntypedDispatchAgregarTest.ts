import { Test } from "../../../Test";

/**
 * @class FunctionUntypedDispatchAgregarTest
 * @description Validates that `agregar` on an unannotated parameter is emitted through `chordAgregar`: it pushes to a lista and adds to a Conjunto.
 */
export class FunctionUntypedDispatchAgregarTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Untyped Dispatch Agregar - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch agregar at run time on an untyped receiver";
}
