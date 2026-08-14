import { Test } from "../../../Test";

/**
 * @class BDOFunctionMemberTest
 * @description Validates that a `funcion` declared inside an Intelligent BDO is exposed as a
 * real member of the resulting object, instead of being lost as an unreachable local declaration.
 */
export class BDOFunctionMemberTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Function Member - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to expose a funcion declared inside a BDOI as a real member of the resulting object';
}
