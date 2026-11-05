import { Test } from "../../../Test";

/**
 * @class ReturnInferredNoReturnStatementTest
 * @description Validates that a function without any devolver called as a statement compiles.
 */
export class ReturnInferredNoReturnStatementTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Return Inferred No Return Statement - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a function with no devolver called as a statement";
}
