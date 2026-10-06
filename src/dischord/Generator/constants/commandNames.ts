/**
 * @file commandNames.ts
 * @description What Discord accepts as the name of a chat input command or of one of its options,
 * and how a `comando`'s identifier becomes the name Discord sees. Shared by `CommandVisitor`
 * (which slugifies the name) and `ValidateCommandRule` (which checks the final name), so both
 * agree on a single definition.
 */

/** Discord's own rule for command and option names; the `u` flag makes `{1,32}` count characters, not UTF-16 units. */
const DISCORD_NAME_PATTERN = /^[-_ʼ\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$/u;

/**
 * Turns a command's identifier into the name Discord sees: a hyphen where a lowercase letter is
 * followed by an uppercase one, then lowercase. Unicode-aware, since Discord command names allow
 * lowercase letters with accents (`canciónPopular` -> `canción-popular`). Digits are not a
 * boundary on purpose, so names like `comando2Nuevo` keep their historical slug (`comando2nuevo`).
 * @param {string} name - The command's identifier as written in source code.
 * @returns {string} The slug.
 */
export function slugifyCommandName (name: string): string {
    return name.replace(/(\p{Ll})(\p{Lu})/gu, '$1-$2').toLowerCase();
}

/**
 * Checks a name against Discord's rules for command and option names.
 * @param {string} name - The final name, as Discord will see it.
 * @returns {string | undefined} Why it is invalid (in Spanish, ready to put in an error message), or `undefined` if Discord accepts it.
 */
export function discordNameProblem (name: string): string | undefined {
    const characters = [ ...name ];

    if (characters.length < 1 || characters.length > 32) {
        return `debe tener entre 1 y 32 caracteres (tiene ${characters.length})`;
    }

    const invalid = characters.find(character => !DISCORD_NAME_PATTERN.test(character));
    if (invalid !== undefined) {
        return `contiene el carácter no permitido '${invalid}' (solo letras, números, '-' y '_')`;
    }

    if (name !== name.toLowerCase()) {
        return `no puede tener mayúsculas, escríbelo en minúsculas ('${name.toLowerCase()}')`;
    }

    return undefined;
}
