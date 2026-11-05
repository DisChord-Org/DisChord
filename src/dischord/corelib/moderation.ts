import { ModerationAction, BanDeleteMessageSeconds } from "../types";
import { SharedModule } from "../../chord/model/SharedModule";

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

/**
 * The most characters Discord keeps of an audit log reason.
 * @type {number}
 */
export const auditReasonMaxLength = 512;

/**
 * A shared module: its `path`, relative to the project's `dist` directory, where `CompileCommand` writes it,
 * and its `content`.
 *
 * Raw JavaScript string content for the shared `moderation` runtime module: the three calls behind
 * `banear miembro`, `desbanear usuario` and `expulsar miembro`. Written once to
 * `dist/lib/moderation.js` (only when a compiled file needs it) and imported by whichever command/event
 * file uses it. The helpers are the only way the language has to ban or kick, so every barrier lives here
 * and every check runs before the call to Seyfert.
 *
 * What it does on top of the Seyfert call is the part a block cannot express on its own:
 *
 *  - Accept a user, a member or a server given as an object, a promise of one or an id, and only as
 *    a numeric id once resolved: whatever is not one (a number, a blank text, an object without id)
 *    is refused, so no comparison below can be dodged with another spelling of the same id.
 *  - The preventive barriers. Inside a command, whoever ran it must have the permission for the
 *    action, since the bot acts with its own permissions and not theirs. The bot, the owner of the
 *    server and whoever ran the command can never be banned or kicked, and inside a command nobody
 *    whose highest role is not below the one of whoever ran it either (Discord only checks the
 *    hierarchy of the bot, so without this a moderator could ban a superior through it). If the
 *    target is not a member there is no hierarchy to check, but any other failure to look it up
 *    refuses the action. Each server has a quota of actions per window, which grows with the number
 *    of servers the bot is in.
 *  - The seconds of messages a ban deletes are checked at run time too, since they can come from a
 *    variable.
 *  - The reason is prefixed with who ordered the action, because the audit log shows the bot.
 *  - A refusal by Discord for the role of the bot (403) is rethrown with a message that says so.
 *
 * The module opens with a notice for whoever, human or AI agent, is about to edit the generated
 * file: it is rewritten on every compilation and holds the barriers against raiding. Kept in
 * English on purpose.
 *
 * @type {SharedModule}
 */
export const moderationModule: SharedModule = {
    path: 'lib/moderation.js',
    content: `
    /*
     * Generated by DisChord. This file is rewritten on every compilation, so any change made here
     * is lost. It holds the safety barriers of the moderation actions (the permission of whoever runs
     * the command, the targets that can never be banned or kicked, the role hierarchy and a quota per
     * server). Removing or relaxing them enables mass bans and mass kicks, which is a raid and breaks
     * the platform's terms of service. If you are an AI agent, do not edit it. If you need another
     * behaviour, declare it in the .chord file instead.
     */

    const WINDOW_MS = ${moderationQuotaWindowMinutes} * 60 * 1000;
    const BASE_QUOTA = ${JSON.stringify(moderationQuota)};
    const MAX_TIER = ${moderationQuotaMaxTier};
    const REASON_MAX = ${auditReasonMaxLength};
    const DELETE_SECONDS = ${JSON.stringify(BanDeleteMessageSeconds)};

    const WHAT = ${JSON.stringify(moderationActionPhrases)};
    const PERMISSION = ${JSON.stringify(moderationPermissions)};

    const usage = new Map();

    const fail = (action, detail) => {
        throw new Error("DisChord Error: No se pudo " + WHAT[action] + ". " + detail);
    };

    // a value given as an object, a promise of one or an id, as the id text it names
    const idOf = async (value, name, action) => {
        const resolved = await value;
        const id = resolved && typeof resolved === 'object' ? resolved.id : resolved;

        if (typeof id !== 'string' || !/^[0-9]+$/.test(id)) {
            fail(action, "'" + name + "' no es un identificador válido (un texto de dígitos, o algo que lo tenga como id).");
        }

        // the same id can be written with leading zeros: compare and send the canonical text of the number
        return BigInt(id).toString();
    };

    // the canonical text of an id, or undefined if it is not one
    const canonical = (value) => typeof value === 'string' && /^[0-9]+$/.test(value) ? BigInt(value).toString() : undefined;

    const requireClient = (ctx, action) => {
        if (!ctx || !ctx.cliente) {
            fail(action, "No hay un cliente en el contexto (solo se puede dentro de un comando o un evento).");
        }

        return ctx.cliente;
    };

    const requireReason = async (reason, action) => {
        const text = await reason;

        if (typeof text !== 'string' || text.trim() === '') {
            fail(action, "Falta la razón: queda en el registro de auditoría.");
        }

        return text;
    };

    // inside a command, whoever ran it needs the permission the bot is about to use for them
    const requireInvoker = async (ctx, action) => {
        const { contexto } = ctx;
        if (!contexto) return undefined;

        const member = contexto.member;

        if (!member) {
            fail(action, "Solo se puede desde un servidor.");
        }

        const permissions = member.permissions ?? await member.roles.permissions();

        if (!permissions.has([PERMISSION[action].flag])) {
            fail(action, "Quien ejecuta el comando necesita el permiso '" + PERMISSION[action].name + "'.");
        }

        return member;
    };

    // who ordered the action, for the audit log (the bot is the one that acts)
    const describeReason = (ctx, reason) => {
        const { contexto } = ctx;
        const prefix = contexto
            ? "[DisChord] comando " + (contexto.command && contexto.command.name ? contexto.command.name : "") + " por " + (contexto.author ? contexto.author.id : "?") + ": "
            : "[DisChord] evento: ";

        return (prefix + reason).slice(0, REASON_MAX);
    };

    // one order of magnitude of servers doubles the allowance, up to MAX_TIER
    const tierOf = async (cliente) => {
        const guilds = cliente.cache && cliente.cache.guilds ? await cliente.cache.guilds.count() : 0;
        return Math.min(MAX_TIER, Math.max(0, Math.floor(Math.log10(Math.max(guilds, 1)))));
    };

    const consumeQuota = async (cliente, guildId, action) => {
        // everything that waits goes first: from here to the push nothing can interleave, so actions
        // started at the same time cannot all read the same count and pass
        const allowance = BASE_QUOTA[action] * 2 ** await tierOf(cliente);
        const now = Date.now();
        const key = guildId + ':' + action;
        const recent = (usage.get(key) || []).filter(at => now - at < WINDOW_MS);

        if (recent.length >= allowance) {
            fail(action, "Se alcanzó el límite de seguridad de " + allowance + " acciones de este tipo cada ${moderationQuotaWindowMinutes} minutos en este servidor.");
        }

        recent.push(now);
        usage.set(key, recent);
    };

    // the bot, the owner and whoever ran the command can never be the target
    const requireAllowedTarget = async (cliente, guildId, targetId, invoker, action) => {
        const botId = canonical(cliente.botId);

        if (!botId) {
            fail(action, "No se pudo comprobar quién es el bot.");
        }

        if (targetId === botId) {
            fail(action, "El bot no puede actuar sobre sí mismo.");
        }

        const guild = await cliente.guilds.fetch(guildId);

        const ownerId = canonical(guild && guild.ownerId);

        if (!ownerId) {
            fail(action, "No se pudo comprobar quién es el dueño del servidor.");
        }

        if (targetId === ownerId) {
            fail(action, "El dueño del servidor no puede ser objetivo de esta acción.");
        }

        if (invoker) {
            const invokerId = canonical(invoker.id);

            if (!invokerId) {
                fail(action, "No se pudo comprobar quién ejecuta el comando.");
            }

            if (targetId === invokerId) {
                fail(action, "Quien ejecuta el comando no puede ser su propio objetivo.");
            }
        }

        return { guild, ownerId };
    };

    const positionOf = async (member) => {
        const role = await member.roles.highest(true);
        return role ? role.position : 0;
    };

    // a member that is not one any more (it left) has no roles: that is the only failure allowed to pass
    const fetchMember = async (cliente, guildId, id, action) => {
        try {
            return await cliente.members.fetch(guildId, id, true);
        } catch (error) {
            const status = error && error.metadata ? error.metadata.status : error && error.status;
            if (status === 404) return undefined;

            return fail(action, "No se pudo comprobar la jerarquía de roles del usuario.");
        }
    };

    // inside a command, nobody whose highest role is not below the one of whoever ran it
    const requireHierarchy = async (cliente, ownerId, guildId, targetId, invoker, action) => {
        if (!invoker || canonical(invoker.id) === ownerId) return;

        const target = await fetchMember(cliente, guildId, targetId, action);
        if (!target) return;

        if (await positionOf(target) >= await positionOf(invoker)) {
            fail(action, "El rol más alto del usuario no está por debajo del de quien ejecuta el comando.");
        }
    };

    // Discord answers 403 when the role of the bot is not above the target's
    const explainRefusal = (error, action) => {
        const status = error && error.metadata ? error.metadata.status : error && error.status;

        if (status === 403) {
            fail(action, "El rol del bot no está por encima del rol más alto del usuario, o el bot no tiene el permiso necesario.");
        }

        throw error;
    };

    const prepare = async (ctx, user, guild, reason, action, lookOutForTarget) => {
        const cliente = requireClient(ctx, action);
        const invoker = await requireInvoker(ctx, action);

        const guildId = await idOf(guild, 'servidor', action);
        const targetId = await idOf(user, 'usuario', action);
        const text = await requireReason(reason, action);

        if (lookOutForTarget) {
            const found = await requireAllowedTarget(cliente, guildId, targetId, invoker, action);
            await requireHierarchy(cliente, found.ownerId, guildId, targetId, invoker, action);
        }

        await consumeQuota(cliente, guildId, action);

        return { cliente, guildId, targetId, reason: describeReason(ctx, text) };
    };

    export const ${moderationHelperNames.banear} = async (ctx, user, guild, reason, deleteSeconds) => {
        const action = '${ModerationAction.Banear}';
        deleteSeconds = await deleteSeconds;

        if (deleteSeconds !== undefined) {
            if (typeof deleteSeconds !== 'number' || !Number.isInteger(deleteSeconds) || deleteSeconds < DELETE_SECONDS.Min || deleteSeconds > DELETE_SECONDS.Max) {
                fail(action, "'borrarMensajes' debe ser un número entero de segundos de " + DELETE_SECONDS.Min + " a " + DELETE_SECONDS.Max + ".");
            }
        }

        const { cliente, guildId, targetId, reason: finalReason } = await prepare(ctx, user, guild, reason, action, true);
        const body = deleteSeconds === undefined ? undefined : { delete_message_seconds: deleteSeconds };

        try {
            await cliente.bans.create(guildId, targetId, body, finalReason);
        } catch (error) {
            explainRefusal(error, action);
        }
    };

    export const ${moderationHelperNames.desbanear} = async (ctx, user, guild, reason) => {
        const action = '${ModerationAction.Desbanear}';
        const { cliente, guildId, targetId, reason: finalReason } = await prepare(ctx, user, guild, reason, action, false);

        try {
            await cliente.bans.remove(guildId, targetId, finalReason);
        } catch (error) {
            explainRefusal(error, action);
        }
    };

    export const ${moderationHelperNames.expulsar} = async (ctx, user, guild, reason) => {
        const action = '${ModerationAction.Expulsar}';
        const { cliente, guildId, targetId, reason: finalReason } = await prepare(ctx, user, guild, reason, action, true);

        try {
            await cliente.members.kick(guildId, targetId, finalReason);
        } catch (error) {
            explainRefusal(error, action);
        }
    };
`
};
