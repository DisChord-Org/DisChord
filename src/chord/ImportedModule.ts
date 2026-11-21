import path from "node:path";
import { CompilationContext } from "./model/CompilationContext";
import { Decorator, TokenType } from "./model/tokens";
import { Lexer } from "./Lexer/Lexer";
import { ChordError } from "../errors/ChordError";
import { File } from "../utils/File";
import { ImportSpecifier } from "../utils/ImportSpecifier";

/**
 * The module an `importar` points at: where it is, and what its Chord source says that the importing file can
 * not know from the import itself. An imported name is opaque (`cualquiera`), so the compiler would not
 * `await` a call to one that is `@asincrono` in its own file. The source of an installed library
 * (`lib:X`) ships beside its compiled `index.js`, and a relative import has its `.chord` next to it.
 * A module without a source (plain JavaScript) tells nothing, and its functions stay as they were.
 *
 * It is also the one place that knows where an installed library lives, which the analyzer (does the
 * module exist) and the generator (which specifier to write) both need.
 */
export class ImportedModule {
    /**
     * @param context - The compilation context, for the project root, the importing file and the keywords.
     * @param specifier - The path of the import, as written after `desde`.
     */
    constructor (
        private readonly context: CompilationContext<string>,
        private readonly specifier: string
    ) {}

    /**
     * @returns {string | undefined} The absolute path of the entry point `chord pkg install` publishes
     * (`lib/X/src/index.js`) when the import names an installed library; `undefined` for a file.
     */
    public libraryEntry (): string | undefined {
        return this.libraryFile('index.js');
    }

    /**
     * @returns {string[]} Every absolute path that would satisfy the import, in lookup order: the entry of
     * the library, or a sibling `.chord` source and the literal file (a `.js` module named explicitly).
     */
    public targets (): string[] {
        const entry = this.libraryEntry();

        if (entry !== undefined) return [ entry ];

        const base = path.resolve(this.context.codeProvider.currentFile.directory, this.specifier.replace(/\.chord$/, ''));

        return [ `${base}.chord`, base ];
    }

    /**
     * The functions the module declares at its top level with `@asincrono`: the ones a call to
     * the importing file has to await. Only the tokens of the source are read, so a module that does not
     * lex (its own compilation reports that) tells nothing.
     *
     * @returns {Set<string>} Their names; empty when the module has no readable source.
     */
    public asyncFunctions (): Set<string> {
        const names = new Set<string>();
        const source = this.source();

        if (source === undefined) return names;

        try {
            const tokens = new Lexer(this.context, source.read()).tokenize();
            let depth = 0;
            let decoratedAsync = false;

            tokens.forEach((token, index) => {
                if (token.type === TokenType.L_BRACE) depth++;
                else if (token.type === TokenType.R_BRACE) depth--;
                else if (token.type === TokenType.Decorador) decoratedAsync = token.value === Decorator.asincrono || decoratedAsync;
                else if (token.type === TokenType.Funcion) {
                    const name = tokens[index + 1];

                    if (decoratedAsync && depth === 0 && name?.type === TokenType.IDENTIFICADOR) names.add(name.value);
                    decoratedAsync = false;
                } else if (token.type !== TokenType.Exportar) decoratedAsync = false;
            });
        } catch (error) {
            if (!(error instanceof ChordError)) throw error;
        }

        return names;
    }

    /**
     * Where the Chord source of the module is: `lib/X/src/index.chord` of the project for a library,
     * the `.chord` beside the importing file otherwise.
     */
    private source (): File | undefined {
        const library = this.libraryFile('index.chord');

        return File.tryOf(library ?? this.targets()[0]);
    }

    /** A file of the `src` folder of the installed library the import names, if it names one. */
    private libraryFile (name: string): string | undefined {
        if (!ImportSpecifier.isLibrary(this.specifier)) return undefined;

        return this.context.projectRoot.resolve('lib', this.specifier.slice(ImportSpecifier.LIB_PREFIX.length), 'src', name);
    }
}
