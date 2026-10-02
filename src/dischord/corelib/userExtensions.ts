import { corelib, DisChordClassesEnum } from "./corelib.data";

/**
 * Spanish property name -> the real Seyfert `User` property/method it reads, taken from the
 * `Usuario` class of `corelib`. `userExtensionsModuleContent` below generates its runtime getters
 * straight from this map (so the two can never drift apart), and `RequiresUserExtensionsRule`
 * scans for these same keys to decide whether a file needs the import.
 * @type {Readonly<Record<string, string>>}
 */
export const userPropertyNames: Readonly<Record<string, string>> = Object.fromEntries(
    Object.entries(corelib.classes[DisChordClassesEnum.Usuario].properties ?? {}).map(([spanish, member]) => [spanish, member.transpile])
);

/**
 * Path, relative to the project's `dist` directory, where `userExtensionsModuleContent` is
 * written. Shared by `CompileCommand` (which writes the file there) and
 * `RequiresUserExtensionsRule` (which imports it), so both sides agree on the location from a
 * single source of truth.
 * @type {string}
 */
export const userExtensionsModulePath = 'lib/userExtensions.js';

/**
 * Raw JavaScript string content for the shared runtime module that patches Seyfert's `User` and
 * `GuildMember` prototypes with Spanish-named getters (`usuario.nombre`, `mencion.colorPerfil`, ...).
 *
 * This exists instead of a compile-time rename (translating `X.nombre` into `X.username` in the
 * emitted source, the way `corelib`'s other entries work) because a command option typed
 * `opcion "usuario"` can be bound to *any* variable name the user picks (`mencion`, `objetivo`,
 * ...) — there's no fixed identifier to key a static translation off. Patching the real Seyfert
 * classes' prototypes once, at runtime, makes the Spanish names work regardless of what the
 * variable holding a `User`/`GuildMember` instance happens to be called.
 *
 * `GuildMember` wraps a `User` by composition (`this.user`), not inheritance, and
 * `InteractionGuildMember extends GuildMember` — so patching both `User` and `GuildMember`
 * prototypes (with `GuildMember`'s getters delegating to `.user`) covers every shape a resolved
 * `"usuario"` option or event/command's `usuario` parameter can actually take.
 * @type {string}
 */
export const userExtensionsModuleContent = `
    import { User, GuildMember } from 'seyfert';

    const userAccessors = new Map([
${Object.entries(userPropertyNames).map(([spanish, real]) => `        ['${spanish}', (u) => u.${real}]`).join(',\n')}
    ]);

    for (const [name, resolve] of userAccessors) {
        Object.defineProperty(User.prototype, name, { get() { return resolve(this); }, configurable: true });
        Object.defineProperty(GuildMember.prototype, name, { get() { return resolve(this.user); }, configurable: true });
    }
`;
