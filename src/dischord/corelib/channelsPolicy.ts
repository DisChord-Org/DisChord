import { ChannelAction } from "../types";

/**
 * The name of the helper of the shared `channels` module that performs each channel action.
 * The one place the names are written: the module below is built from them, `ChannelActionVisitor`
 * emits the call to them and `RequiresChannelHelperRule` imports them.
 * @type {Readonly<Record<ChannelAction, string>>}
 */
export const channelHelperNames: Readonly<Record<ChannelAction, string>> = {
    [ChannelAction.Crear]: 'createChannel',
    [ChannelAction.Editar]: 'editChannel',
    [ChannelAction.Borrar]: 'deleteChannel',
    [ChannelAction.Obtener]: 'getChannel',
    [ChannelAction.Listar]: 'listChannels'
};

/**
 * What each action is called in the message of an error: "No se pudo <esto>.".
 * @type {Readonly<Record<ChannelAction, string>>}
 */
export const channelActionPhrases: Readonly<Record<ChannelAction, string>> = {
    [ChannelAction.Crear]: 'crear el canal',
    [ChannelAction.Editar]: 'editar el canal',
    [ChannelAction.Borrar]: 'borrar el canal',
    [ChannelAction.Obtener]: 'obtener el canal',
    [ChannelAction.Listar]: 'listar los canales'
};

/**
 * How many channel actions of each kind a server allows inside one window, for a bot in fewer than
 * ten servers. Deliberately not configurable by whoever writes the bot: a barrier its author can
 * lift is not one. A bigger bot gets more room (see `channelQuotaMaxTier`).
 * @type {Readonly<Record<'crear' | 'editar' | 'borrar', number>>}
 */
export const channelQuota: Readonly<Record<'crear' | 'editar' | 'borrar', number>> = {
    [ChannelAction.Crear]: 10,
    [ChannelAction.Editar]: 10,
    [ChannelAction.Borrar]: 5
};

/**
 * Length of the window the quota counts in, in minutes.
 * @type {number}
 */
export const channelQuotaWindowMinutes = 10;

/**
 * The quota doubles for every order of magnitude of servers the bot is in: ×1 under ten servers,
 * ×2 from ten, ×4 from a hundred, ×8 from a thousand. It stops there, so no bot, however big,
 * has an unbounded allowance. A bot with few servers is the likeliest to be a throwaway one.
 * @type {number}
 */
export const channelQuotaMaxTier = 3;
