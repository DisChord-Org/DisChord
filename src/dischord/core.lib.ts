/**
 * Core library mapping object that translates keywords
 * and properties into their runtime equivalents.
 *
 * @category Transpiler Maps
 * @type {Readonly<Record<string, Record<string, string> | string>>}
 */
export const corelib: Record<string, Record<string, string> | string> = {
    'usuario': {
        'id': 'usuario.id',
        'nombre': 'usuario.username',
        'nombreGlobal': 'usuario.globalName',
        'etiqueta': 'usuario.tag',
        'discriminador': 'usuario.discriminator',
        'flags': 'usuario.publicFlags',
        'esBot': 'usuario.bot',
        'esSistema': 'usuario.system',
        'avatar': 'usuario.avatarURL()',
        'banner': 'usuario.bannerURL()',
        'colorPerfil': 'usuario.accentColor',
        'tipoPremium': 'usuario.premiumType'
    },
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
