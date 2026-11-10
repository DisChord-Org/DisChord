/**
 * The JavaScript source of the barriers that the `channels` and `moderation` runtime modules share
 * and that depend on who ordered the action and where: how an id is written, whether the server an
 * action is aimed at is the one the command runs in, and what the audit log says about who ordered it.
 * Written once so the two modules cannot drift apart; each module keeps its own way of failing (the
 * `refuse` callbacks) and its own `WHAT` table.
 *
 * Removing or relaxing any of them enables actions on a server other than the one the permission
 * was checked in, so a change here is a change to both modules and goes through review.
 */
export class ContextRuntime {
    /**
     * The most characters Discord keeps of an audit log reason.
     */
    public static readonly auditReasonMaxLength = 512;

    /**
     * @returns {string} The `isId`, `canonicalId` and `sameId` declarations, indented to sit inside the module.
     * An id can be written with leading zeros (`"0123"` is `"123"` for Discord), so every comparison and
     * every key that counts something per server goes through the canonical text of the number.
     */
    public static renderIds (): string {
        return `    // an id is a text of digits
    const isId = (value) => typeof value === 'string' && /^[0-9]+$/.test(value);

    // the same id can be written with leading zeros: compare, count and send the canonical text of the number
    const canonicalId = (value) => isId(value) ? BigInt(value).toString() : value;

    // two ids are the same only if both exist
    const sameId = (a, b) => a !== undefined && a !== null && canonicalId(a) === canonicalId(b);`;
    }

    /**
     * @param {(message: string) => string} refuse Builds the statement that refuses the action. It
     * receives the text of the refusal as the inside of a JavaScript string literal and must end the
     * statement with its own `;`.
     * @returns {string} The `requireContextGuild` declaration, indented to sit inside the module. It needs
     * `sameId` and an `action` in scope of the refusal.
     */
    public static renderContextGuild (refuse: (message: string) => string): string {
        return `    // inside a command, the server the action is aimed at has to be the one the command runs in: that is
    // where the permission of whoever ran it was looked at. An event has no such server to compare with.
    const requireContextGuild = (ctx, guildId, action) => {
        if (!ctx.contexto) return;

        if (!sameId(ctx.contexto.guildId, guildId)) {
            ${refuse('El servidor indicado no es el del contexto.')}
        }
    };`;
    }

    /**
     * @returns {string} The `describeReason` declaration, indented to sit inside the module: the reason
     * prefixed with who ordered the action, because the audit log shows the bot, cut to what Discord keeps.
     */
    public static renderReason (): string {
        return `    // who ordered the action, for the audit log (the bot is the one that acts)
    const describeReason = (ctx, reason) => {
        const { contexto } = ctx;
        const prefix = contexto
            ? "[DisChord] comando " + (contexto.command && contexto.command.name ? contexto.command.name : "") + " por " + (contexto.author ? contexto.author.id : "?")
            : "[DisChord] evento";

        return (reason === undefined ? prefix : prefix + ": " + reason).slice(0, ${ContextRuntime.auditReasonMaxLength});
    };`;
    }
}
