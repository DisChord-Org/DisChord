import { ChannelAction, ChannelPayload, ChannelProperty } from "../types";

/**
 * The name of the helper of the shared `channels` module that performs each channel action.
 * The one place the names are written: the module below is built from them, `ChannelActionVisitor`
 * emits the call to them and `RequiresChannelHelperRule` imports them.
 * @type {Readonly<Record<ChannelAction, string>>}
 */
export const channelHelperNames: Readonly<Record<ChannelAction, string>> = {
    [ChannelAction.Crear]: 'createChannel',
    [ChannelAction.Editar]: 'editChannel',
    [ChannelAction.Borrar]: 'deleteChannel'
};

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
        return '${ChannelPayload.Parent}' in body ? { ...body, ${ChannelPayload.Parent}: await idOf(body.${ChannelPayload.Parent}) } : body;
    };

    export const ${channelHelperNames.crear} = async (ctx, guild, body) => {
        const cliente = requireClient(ctx, '${ChannelAction.Crear}');
        const guildId = await requireId(guild, '${ChannelProperty.Servidor}', '${ChannelAction.Crear}');

        return await cliente.guilds.channels.create(guildId, await withParentId(body));
    };

    export const ${channelHelperNames.editar} = async (ctx, channel, body, reason) => {
        const cliente = requireClient(ctx, '${ChannelAction.Editar}');
        const channelId = await requireId(channel, '${ChannelProperty.Canal}', '${ChannelAction.Editar}');

        return await cliente.channels.edit(channelId, await withParentId(body), { reason });
    };

    export const ${channelHelperNames.borrar} = async (ctx, channel, reason) => {
        const cliente = requireClient(ctx, '${ChannelAction.Borrar}');
        const channelId = await requireId(channel, '${ChannelProperty.Canal}', '${ChannelAction.Borrar}');

        return await cliente.channels.delete(channelId, { reason });
    };
`;
