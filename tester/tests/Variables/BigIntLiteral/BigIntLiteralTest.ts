import { Test } from "../../../Test";

/**
 * @class BigIntLiteralTest
 * @description It has to keep the BigInt suffix in the generated code and give the literal a numeric value
 */
export class BigIntLiteralTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BigInt Literal - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep the BigInt suffix in the generated code and give the literal a numeric value";
}
