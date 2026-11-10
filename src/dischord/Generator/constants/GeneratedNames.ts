/**
 * The names the generator itself declares or imports at the top level of a file, in one place: the
 * visitors interpolate them into the code they emit, and `ValidateGeneratedNamesRule` rejects a
 * declaration of the user's that would take one of them (a second declaration of the same name in
 * the file is a SyntaxError once it runs). A name added to what a visitor emits has to be added
 * here, or the test that compares the two fails.
 * @class GeneratedNames
 */
export class GeneratedNames {
    /** The module the Discord classes are imported from. */
    public static readonly SeyfertModule = 'seyfert';

    /** What each kind of file imports from {@link SeyfertModule}. */
    public static readonly SeyfertImports = {
        command: [ 'Command', 'IgnoreCommand', 'Embed', 'ActionRow', 'Button', 'createStringOption' ],
        event: [ 'createEvent', 'Embed', 'ActionRow', 'Button' ],
        client: [ 'Client' ]
    } as const;

    /** The constant a command with options declares them in. */
    public static readonly OptionsConstantName = 'options';

    /** Appended to the name of a command to name its class (`Hola` is `HolaCommand`). */
    public static readonly CommandClassSuffix = 'Command';

    /** The constant `encender bot` creates the client in. */
    public static readonly ClientConstantName = 'client';

    /**
     * @param {keyof typeof GeneratedNames.SeyfertImports} kind - The kind of file.
     * @param {string} [quote] - The quote the module name is written with.
     * @returns {string} The import statement of the file, e.g. `import { createEvent, Embed } from 'seyfert';`.
     */
    public static importStatement (kind: keyof typeof GeneratedNames.SeyfertImports, quote: string = "'"): string {
        return `import { ${GeneratedNames.SeyfertImports[kind].join(', ')} } from ${quote}${GeneratedNames.SeyfertModule}${quote};`;
    }

    /**
     * @param {string} commandName - The name of the command as written.
     * @returns {string} The name of the class generated for it.
     */
    public static commandClassName (commandName: string): string {
        return `${commandName}${GeneratedNames.CommandClassSuffix}`;
    }
}
