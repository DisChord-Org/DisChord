/**
 * Path, relative to the project's `dist` directory, where `channelsModuleContent` is written.
 * Shared by `CompileCommand` (which writes the file there) and the rule that imports it, so both
 * sides agree on the location from a single source of truth.
 * @type {string}
 */
export const channelsModulePath = 'lib/channels.js';

/**
 * Raw JavaScript string content for the shared `channels` runtime module: the three calls behind
 * `crear canal`, `editar canal` and `borrar canal`. Written once to `dist/lib/channels.js` (only
 * when a compiled file needs it) and imported by whichever command/event file uses it.
 *
 * What it does on top of the Seyfert call is the part a block cannot express on its own: accept a
 * channel or guild given as an object or as an id, resolve the guild to create in from the
 * command/event context when `servidor` is omitted, and wait for a value that is still a promise
 * (the `canal` a command has in scope is fetched, not awaited).
 *
 * @type {string}
 */
export const channelsModuleContent = `
    const idOf = async (value) => {
        const resolved = await value;
        return resolved && typeof resolved === 'object' ? resolved.id : resolved;
    };

    export const createChannel = async (ctx, guild, body) => {
        const { cliente, contexto, mensaje } = ctx || {};
        const guildId = (await idOf(guild)) ?? (contexto && contexto.guildId) ?? (mensaje && mensaje.guildId);

        if (!guildId) {
            throw new Error("DisChord Error: No se pudo crear el canal. Falta el campo 'servidor' o no hay un servidor en el contexto.");
        }

        return await cliente.guilds.channels.create(guildId, body);
    };

    export const editChannel = async (ctx, channel, body, reason) => {
        const channelId = await idOf(channel);
        return await ctx.cliente.channels.edit(channelId, body, { reason });
    };

    export const deleteChannel = async (ctx, channel, reason) => {
        const channelId = await idOf(channel);
        return await ctx.cliente.channels.delete(channelId, { reason });
    };
`;
