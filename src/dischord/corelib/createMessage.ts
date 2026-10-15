import { SharedModule } from "../../chord/model/SharedModule";

/**
 * A shared module: its `path`, relative to the project's `dist` directory, where `CompileCommand` writes it,
 * and its `content`.
 *
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
 * * @type {SharedModule}
 */
export const createMessageModule: SharedModule = {
    path: 'lib/createMessage.js',
    content: `
    export const createMessage = async (channel, options, interactionContext, ctx, user) => {
        const { cliente, contexto, mensaje } = ctx || {};

        // if user (direct message), alongside the channel when both are given
        if (user) {
            const sent = channel ? await cliente.messages.write(channel, options) : undefined;
            const direct = await cliente.users.write(typeof user === 'string' ? user : user.id, options);
            return sent ?? direct;
        }

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
`
};
