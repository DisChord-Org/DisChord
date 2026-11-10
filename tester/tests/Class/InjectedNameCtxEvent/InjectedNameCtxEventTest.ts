import { Test } from "../../../Test";

/**
 * @class InjectedNameCtxEventTest
 * @description It has to reject declaring ctx inside an event, which the generated code declares
 */
export class InjectedNameCtxEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Injected Name Ctx Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject declaring ctx inside an event, which the generated code declares";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "No se puede declarar 'ctx': el evento 'mensajeCreado' ya lo define.";
}
