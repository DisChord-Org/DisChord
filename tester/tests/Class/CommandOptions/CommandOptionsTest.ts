import { Test } from "../../../Test";

/**
 * @class CommandOptionsTest
 * @description Validates a command's `opciones { <nombre> { opcion ...; descripcion ...; requerido ...; } }`
 * (from `examples/commandOptionsBot.chord`) compiles to a real Seyfert `options` array, and that
 * the option is destructured from `contexto.options` for use in the command body.
 *
 * Regression coverage: `opciones { ... }` never carries a trailing ';', and commands parse their
 * whole body in Intelligent BDO mode — `BDOParser` used to require every property to end in ';'
 * in that mode with no exception for BDO-valued ones, so this whole block used to be silently
 * misparsed as a series of bare statements instead of the command's option definitions.
 */
export class CommandOptionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Options - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to generate a command's string option and destructure it from contexto.options";
}
