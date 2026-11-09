import { Test } from "../../../Test";

/**
 * @class StartBotKeyTypoTest
 * @description Validates that a key of `encender bot` that is a typo of a declared one is rejected with a suggestion, instead of silently becoming a property of `cliente`
 */
export class StartBotKeyTypoTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Key Typo - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject 'intencion' in 'encender bot' and suggest 'intenciones'";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "¿Querías decir 'intenciones'?";
}
