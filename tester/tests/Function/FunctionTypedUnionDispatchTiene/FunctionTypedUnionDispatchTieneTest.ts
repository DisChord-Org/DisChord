import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionDispatchTieneTest
 * @description Validates that `texto|Mapa` and `tiene` is emitted through the `chordTiene` helper, with its import.
 */
export class FunctionTypedUnionDispatchTieneTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Dispatch Tiene - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch tiene at run time on a texto|Mapa receiver";
}
