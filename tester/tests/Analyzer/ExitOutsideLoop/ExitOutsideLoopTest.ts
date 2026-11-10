import { Test } from "../../../Test";

/**
 * @class ExitOutsideLoopTest
 * @description It has to reject salir outside a loop
 */
export class ExitOutsideLoopTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Exit Outside Loop - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject salir outside a loop";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "'salir' solo puede usarse dentro de un bucle 'para'.";
}
