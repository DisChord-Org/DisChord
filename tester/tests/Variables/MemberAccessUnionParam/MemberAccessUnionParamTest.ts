import { Test } from "../../../Test";

/**
 * @class MemberAccessUnionParamTest
 * @description Pins how a call on a union typed parameter is emitted.
 */
export class MemberAccessUnionParamTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Member Access Union Param - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to dispatch tiene on a Mapa|texto parameter";
}
