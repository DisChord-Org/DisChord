import { Test } from "../../../Test";

/**
 * @class GeneratedNameChordIterableTest
 * @description It has to reject chordIterable in a file with a loop
 */
export class GeneratedNameChordIterableTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Name Chord Iterable - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject chordIterable in a file with a loop";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "El nombre 'chordIterable' lo usa DisChord en el código generado de este archivo: renómbralo.";
}
