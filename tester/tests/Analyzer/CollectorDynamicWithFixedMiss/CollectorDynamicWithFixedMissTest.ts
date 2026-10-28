import { Test } from "../../../Test";

/**
 * @class CollectorDynamicWithFixedMissTest
 * @description Validates the message when a key matches no id and the message has fixed and dynamic ids.
 */
export class CollectorDynamicWithFixedMissTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Dynamic With Fixed Miss - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to name the fixed and the dynamic ids";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "alPulsarId espera un botón con id 'otro', pero el mensaje 'msg' solo tiene ids fijos ('aceptar') y uno dinámico ('b{n}')";
}
