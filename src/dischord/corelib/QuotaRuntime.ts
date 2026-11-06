/**
 * The JavaScript source of the quota barrier that the `channels` and `moderation` runtime modules
 * share: how many servers the bot is in decides the tier, the tier decides the allowance, and every
 * action of a server is counted inside a window. Written once so the two modules cannot drift apart
 * in how the quota is counted; each module keeps its own numbers (`WINDOW_MS`, `BASE_QUOTA`,
 * `MAX_TIER`, `usage`) and its own way of failing.
 *
 * The emitted code expects those four constants and a `WHAT` table to exist in the module that
 * embeds it. Removing or relaxing this barrier enables mass actions, so a change here is a change to
 * both modules and goes through review.
 */
export class QuotaRuntime {
    /**
     * @param {number} windowMinutes The length of the window, for the message of the refusal.
     * @param {(limitMessage: string) => string} refuse Builds the statement that refuses the action. It
     * receives the text of the refusal as the inside of a JavaScript string literal, which refers to
     * `allowance`, and must end the statement with its own `;`.
     * @returns {string} The `tierOf` and `consumeQuota` declarations, indented to sit inside the module.
     */
    public static render (windowMinutes: number, refuse: (limitMessage: string) => string): string {
        const limitMessage = `Se alcanzó el límite de seguridad de " + allowance + " acciones de este tipo cada ${windowMinutes} minutos en este servidor.`;

        return `    // one order of magnitude of servers doubles the allowance, up to MAX_TIER
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
            ${refuse(limitMessage)}
        }

        recent.push(now);
        usage.set(key, recent);
    };`;
    }
}
