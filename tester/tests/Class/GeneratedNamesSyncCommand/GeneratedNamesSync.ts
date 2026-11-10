import { GeneratedNames } from "../../../../src/dischord/Generator/constants/GeneratedNames";

/**
 * What the generated code of a file declares at the top level, to compare it with {@link GeneratedNames}: not a
 * `Test`, so the runner does not pick it up. It is the check that keeps the list of names the analyzer
 * protects in step with what the visitors emit.
 * @class GeneratedNamesSync
 */
export class GeneratedNamesSync {
    /**
     * The folder name the shared runtime modules are imported from. What they bring in is held back by
     * the synthetic imports themselves, so it is not part of the fixed list.
     */
    private static readonly SharedModules = 'lib/';

    /**
     * @param {string} js - The generated code of a file, formatted.
     * @returns {string[]} The names it imports (except from the shared modules) or declares at column 0.
     */
    public static topLevelNames (js: string): string[] {
        const names: string[] = [];

        for (const line of js.split(/\r?\n/)) {
            const named = line.match(/^import \{([^}]*)\} from ['"]([^'"]+)['"]/);

            if (named) {
                if (!named[2].includes(GeneratedNamesSync.SharedModules)) names.push(...named[1].split(',').map(name => name.trim()).filter(Boolean));
                continue;
            }

            const declared = line.match(/^(?:export default )?(?:async )?(?:const|let|var|class|function)\s+([A-Za-z_$][\w$]*)/);

            if (declared) names.push(declared[1]);
        }

        return names;
    }

    /**
     * @param {string} js - The generated code of a file, formatted.
     * @param {string[]} allowed - The names the generator is known to declare for this kind of file.
     * @throws {Error} If the file declares a name that is not in the list.
     */
    public static assertOnly (js: string, allowed: readonly string[]): void {
        const unknown = GeneratedNamesSync.topLevelNames(js).filter(name => !allowed.includes(name));

        if (unknown.length > 0) {
            throw new Error(`The generated code declares ${unknown.map(name => `'${name}'`).join(', ')}, which GeneratedNames does not list: add it there so ValidateGeneratedNamesRule protects it.`);
        }
    }

    /**
     * @returns {readonly string[]} What a command file declares: its Seyfert imports, its class and its `options`.
     */
    public static commandNames (commandName: string): readonly string[] {
        return [ ...GeneratedNames.SeyfertImports.command, GeneratedNames.commandClassName(commandName), GeneratedNames.OptionsConstantName ];
    }
}
