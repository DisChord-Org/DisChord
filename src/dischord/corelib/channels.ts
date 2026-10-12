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
 * channel, category or server given as an object, a promise of one or an id (the `canal` a command
 * has in scope is fetched, not awaited), and fail with a message that names the missing piece
 * instead of Seyfert's own. Which server a `crear canal` defaults to is decided at compile time
 * and arrives here already resolved.
 *
 * @type {string}
 */
export const channelsModuleContent = `
    const idOf = async (value) => {
        const resolved = await value;
        return resolved && typeof resolved === 'object' ? resolved.id : resolved;
    };

    const requireClient = (ctx, action) => {
        if (!ctx || !ctx.cliente) {
            throw new Error("DisChord Error: No se pudo " + action + " el canal. No hay un cliente en el contexto (solo se puede dentro de un comando o un evento).");
        }

        return ctx.cliente;
    };

    const requireId = async (value, name, action) => {
        const id = await idOf(value);

        if (!id) {
            throw new Error("DisChord Error: No se pudo " + action + " el canal. Falta el valor de '" + name + "'.");
        }

        return id;
    };

    const withParentId = async (body) => {
        return 'parent_id' in body ? { ...body, parent_id: await idOf(body.parent_id) } : body;
    };

    export const createChannel = async (ctx, guild, body) => {
        const cliente = requireClient(ctx, 'crear');
        const guildId = await requireId(guild, 'servidor', 'crear');

        return await cliente.guilds.channels.create(guildId, await withParentId(body));
    };

    export const editChannel = async (ctx, channel, body, reason) => {
        const cliente = requireClient(ctx, 'editar');
        const channelId = await requireId(channel, 'canal', 'editar');

        return await cliente.channels.edit(channelId, await withParentId(body), { reason });
    };

    export const deleteChannel = async (ctx, channel, reason) => {
        const cliente = requireClient(ctx, 'borrar');
        const channelId = await requireId(channel, 'canal', 'borrar');

        return await cliente.channels.delete(channelId, { reason });
    };
`;
