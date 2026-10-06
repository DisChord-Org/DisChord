import { Test } from "../../../Test";

/**
 * @class FunctionTypedUnionSameTranspileTest
 * @description Validates that a union whose classes all map `tiene` to the same member (`texto|Lista`: `includes`) is emitted directly, with no helper.
 */
export class FunctionTypedUnionSameTranspileTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Function Typed Union Same Transpile - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to call includes directly on a texto|Lista receiver";
}
