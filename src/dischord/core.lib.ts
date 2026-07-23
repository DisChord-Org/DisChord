/**
 * Core library mapping object that translates keywords
 * and properties into their runtime equivalents.
 *
 * @category Transpiler Maps
 * @type {Readonly<Record<string, Record<string, string> | string>>}
 */
export const corelib: Record<string, Record<string, string> | string> = {
    'usuario': {
        'nombre': 'usuario.username',
        'flags': 'usuario.publicFlags',
        'nombreGlobal': 'usuario.globalName'
    },
    'cliente': {
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
 * Raw JavaScript string code block injected into the transpiled output.
 * It defines the internal asynchronous helper function `createMessage` responsible for handling messaging context.
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
export const createMessageFunctionInjection = `
    const createMessage = async (channel, options, interactionContext = null) => {

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
        if (typeof contexto !== 'undefined' && contexto.editOrReply) {
            if (!contexto.deferred) {
                await contexto.deferReply().catch(() => {});
            }
            return await contexto.editOrReply(options, true);
        }

        // if we're inside a command events
        if (typeof mensaje !== 'undefined' && mensaje.write) {
            return await mensaje.write(options, true);
        }

        throw new Error("DisChord Error: No se pudo enviar el mensaje. Falta el parámetro 'canal' o no hay un contexto de respuesta (comando/mensaje).");
    };
`;
