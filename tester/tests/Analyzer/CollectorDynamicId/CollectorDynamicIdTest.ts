import { Test } from "../../../Test";

/**
 * @class CollectorDynamicIdTest
 * @description Validates that a key of alPulsarId is rejected when the only button has an id with braces, which is known only when it runs.
 */
export class CollectorDynamicIdTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Dynamic Id - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject a key when the button id is dynamic";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "alPulsarId espera un botón con id 'b1', pero el mensaje 'msg' solo tiene uno dinámico ('b{n}'); alPulsarId no puede enlazar ids dinámicos.";
}
