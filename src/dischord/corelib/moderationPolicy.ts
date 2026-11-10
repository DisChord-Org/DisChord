import { ModerationAction } from "../types";

/**
 * The name of the helper of the shared `moderation` module that performs each moderation action.
 * The one place the names are written: the module below is built from them, `ModerationActionVisitor`
 * emits the call to them and `RequiresModerationHelperRule` imports them.
 * @type {Readonly<Record<ModerationAction, string>>}
 */
export const moderationHelperNames: Readonly<Record<ModerationAction, string>> = {
    [ModerationAction.Banear]: 'banMember',
    [ModerationAction.Desbanear]: 'unbanMember',
    [ModerationAction.Expulsar]: 'kickMember'
};

/**
 * What each action is called in the message of an error: "No se pudo <esto>.".
 * @type {Readonly<Record<ModerationAction, string>>}
 */
export const moderationActionPhrases: Readonly<Record<ModerationAction, string>> = {
    [ModerationAction.Banear]: 'banear al usuario',
    [ModerationAction.Desbanear]: 'desbanear al usuario',
    [ModerationAction.Expulsar]: 'expulsar al miembro'
};

/**
 * The permission whoever runs a command needs for each action: the bot acts with its own
 * permissions, not theirs. Unbanning needs the same one as banning.
 * @type {Readonly<Record<ModerationAction, { flag: string; name: string }>>}
 */
export const moderationPermissions: Readonly<Record<ModerationAction, { flag: string; name: string }>> = {
    [ModerationAction.Banear]: { flag: 'BanMembers', name: 'Banear miembros' },
    [ModerationAction.Desbanear]: { flag: 'BanMembers', name: 'Banear miembros' },
    [ModerationAction.Expulsar]: { flag: 'KickMembers', name: 'Expulsar miembros' }
};

/**
 * How many moderation actions of each kind a server allows inside one window, for a bot in fewer
 * than ten servers. Deliberately not configurable by whoever writes the bot: a barrier its author can
 * lift is not one. A bigger bot gets more room (see `moderationQuotaMaxTier`).
 * @type {Readonly<Record<ModerationAction, number>>}
 */
export const moderationQuota: Readonly<Record<ModerationAction, number>> = {
    [ModerationAction.Banear]: 3,
    [ModerationAction.Desbanear]: 5,
    [ModerationAction.Expulsar]: 5
};

/**
 * Length of the window the quota counts in, in minutes.
 * @type {number}
 */
export const moderationQuotaWindowMinutes = 10;

/**
 * The quota doubles for every order of magnitude of servers the bot is in: ×1 under ten servers,
 * ×2 from ten, ×4 from a hundred, ×8 from a thousand. It stops there, so no bot, however big,
 * has an unbounded allowance.
 * @type {number}
 */
export const moderationQuotaMaxTier = 3;
