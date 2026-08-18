/**
 * Core library mapping object that translates keywords
 * and properties into their runtime equivalents.
 *
 * @category Transpiler Maps
 * @type {Readonly<Record<string, Record<string, string> | string>>}
 */
export const corelib: Record<string, Record<string, string> | string> = {
    'cliente': {
        'emitir': 'cliente.events.runEvent',
        'id': 'cliente.me.id',
        'nombre': 'cliente.me.username',
        'avatar': 'cliente.me.avatar',
        'avatarUrl': 'cliente.me.avatarUrl',
        'ping': 'cliente.gateway.latency'
    },
    'canal': {
        'topico': 'canal.topic',
        'ratelimit': 'canal.rateLimitPerUser',
        'posicion': 'canal.position',
        'categoria': 'canal.parentId',
        'nombre': 'canal.name',
        'ultimoMensaje': 'canal.lastMessageId'
    },
    'imprimir': 'cliente.logger.info'
} as const;

/**
 * Path, relative to the project's `dist` directory, where `createMessageModuleContent` is
 * written. Shared by `CompileCommand` (which writes the file there) and any generator that
 * needs to import it, so both sides agree on the location from a single source of truth.
 * @type {string}
 */
export const createMessageModulePath = 'lib/createMessage.js';

/**
 * Raw JavaScript string content for the shared, standalone `createMessage` runtime module.
 * Written once to `dist/lib/createMessage.js` by `CompileCommand` (only when at least one
 * compiled file actually needs it) and imported by any command/event file that calls it,
 * instead of every generated file duplicating the whole helper inline.
 *
 * This function evaluates channel availability, component interaction status,
 * command context, or raw message event context to properly deliver or reply to messages.
 *
 * @param {unknown} channel - Target channel object or identifier where the message should be dispatched.
 * @param {unknown} options - Content payload, embeddings, or parameters defining the message body.
 * @param {unknown} [interactionContext=null] - Execution context when triggered from interactive components.
 * @returns {Promise<unknown>} Resolves with the dispatched message outcome or interaction response.
 * @throws {Error} Throws an error if no valid target channel or messaging execution context is available.
 * * @type {string}
 */
export const createMessageModuleContent = `
    export const createMessage = async (channel, options, interactionContext, ctx) => {
        const { cliente, contexto, mensaje } = ctx || {};

        // if channel
        if (channel) {
            return await cliente.messages.write(channel, options);
        }

        // if we're inside a component interaction
        if (interactionContext && interactionContext.editOrReply) {
            if (!interactionContext.deferred) {
                await interactionContext.deferReply().catch(() => {});
            }
            return await interactionContext.editOrReply(options, true);
        }

        // if we're inside a command
        if (contexto && contexto.editOrReply) {
            if (!contexto.deferred) {
                await contexto.deferReply().catch(() => {});
            }
            return await contexto.editOrReply(options, true);
        }

        // if we're inside a command events
        if (mensaje && mensaje.write) {
            return await mensaje.write(options, true);
        }

        throw new Error("DisChord Error: No se pudo enviar el mensaje. Falta el parámetro 'canal' o no hay un contexto de respuesta (comando/mensaje).");
    };
`;

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
