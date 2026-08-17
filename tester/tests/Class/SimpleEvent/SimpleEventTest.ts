import { Test } from "../../../Test";

/**
 * @class SimpleEventTest
 * @description Validates `nuevo evento encendido { ... }` (from `examples/easyBot.chord`)
 * compiles to a proper Seyfert `createEvent({ data: { name: 'ready' }, run(...) {...} })`.
 */
export class SimpleEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to generate a 'ready' event handler correctly";
}
