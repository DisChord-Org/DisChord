import { Test } from "../../../Test";

/**
 * @class KnownNamesCommandInjectedTest
 * @description Validates that the names a command puts in scope (`contexto`, `cliente`, `usuario`, `canal`, `ctx`) are known inside its body.
 */
export class KnownNamesCommandInjectedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Known Names Command Injected - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to accept the names injected into a command";
}
