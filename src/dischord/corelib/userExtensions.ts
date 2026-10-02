/**
 * Spanish property name -> the real Seyfert `User` property/method it reads. Single source of
 * truth for the user-data translation: `userExtensionsModuleContent` below generates its runtime
 * getters straight from this map (so the two can never drift apart), and
 * `RequiresUserExtensionsRule` scans for these same keys to decide whether a file needs the
 * import — no separate list to keep in sync by hand.
 *
 * Keys must never equal a raw field name Seyfert assigns internally while constructing its own
 * `User`/`ClientUser`/`GuildMember` objects (`Object.assign(this, rawData)` in
 * `ClientUser`/`DiscordBase`) — a getter-only accessor of the same name on the prototype blocks
 * that assignment outright (`Cannot set property flags of [object Object] which has only a
 * getter`), breaking construction of every such object, not just property access. This is why
 * the keys below are `avatarUrl`/`bannerUrl`/`insignias` rather than the more literal
 * `avatar`/`banner`/`flags` — those three collide with real raw fields; everything else here is a
 * genuinely new word with nothing to collide with.
 * @type {Readonly<Record<string, string>>}
 */
export const userPropertyNames: Record<string, string> = {
    'nombre': 'username',
    'nombreGlobal': 'globalName',
    'etiqueta': 'tag',
    'discriminador': 'discriminator',
    'insignias': 'publicFlags',
    'esBot': 'bot',
    'esSistema': 'system',
    'avatarUrl': 'avatarURL()',
    'bannerUrl': 'bannerURL()',
    'colorPerfil': 'accentColor',
    'tipoPremium': 'premiumType'
} as const;

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
