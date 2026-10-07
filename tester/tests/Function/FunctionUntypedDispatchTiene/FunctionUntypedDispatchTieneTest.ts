import { Test } from "../../../Test";

/**
 * @class FunctionUntypedDispatchTieneTest
 * @description Validates that `tiene` on an unannotated parameter is emitted through `chordTiene`, so it works with a texto, a lista, a Mapa and a Conjunto.
 */
export class FunctionUntypedDispatchTieneTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Untyped Dispatch Tiene - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch tiene at run time on an untyped receiver";
}
