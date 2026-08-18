import { Test } from "../../../Test";

/**
 * @class CommandOptionUserDataTest
 * @description Regression test for a real bug: a command option typed `opcion "usuario"` can be
 * bound to any variable name (here `mencion`, not the built-in `usuario`), but the Spanish
 * user-data properties (`.nombre`, `.colorPerfil`, `.avatar`, ...) used to only translate for the
 * literal identifier `usuario` — `mencion.nombre` compiled to itself unchanged and returned
 * `undefined` at runtime, since no such property exists on Seyfert's real `User`/`GuildMember`.
 * Fixed by moving the translation from a compile-time, identifier-name-keyed rewrite into a
 * runtime prototype patch (`RequiresUserExtensionsRule` / `userExtensionsModuleContent`) that
 * defines the Spanish getters directly on `User`/`GuildMember`, so they work no matter what the
 * variable holding one is called.
 */
export class CommandOptionUserDataTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Option User Data - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave Spanish user-data properties untranslated (relying on the runtime patch) for a command option bound to any name, not just the literal 'usuario'";
}
