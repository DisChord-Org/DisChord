import fs from 'fs';
import path from 'path';
import { File } from './File';
import { Directory } from './Directory';

/**
 * Global configuration contract for the compiler's environment.
 */
export interface CompilerConfig {
    input: File | Directory;    // The entry: a single script or a whole project
    projectRoot: Directory;     // The project root (where the dist directory is located)
    distDir: string;            // Output path for the compiled .js files; may not exist yet
}

/**
 * Static utility class for the compiler's project layout: where the project starts, which files
 * belong to it and where its output goes.
 */
export class FileSystem {
    /** The folder of a project that holds its `.chord` sources. */
    public static readonly SOURCE_DIR = 'src';

    /** The file that marks the root of a project. */
    private static readonly PROJECT_MANIFEST = 'package.json';

    /**
     * Initializes the compiler configuration by analyzing the input path.
     * @param rawInput - The raw string path received from the CLI.
     * @returns A validated CompilerConfig object.
     * @throws Will throw an error if the path does not exist.
     */
    static configure(rawInput: string): CompilerConfig {
        const resolved = path.resolve(rawInput);

        return FileSystem.layoutOf(fs.statSync(resolved).isDirectory() ? Directory.of(resolved) : File.of(resolved));
    }

    /**
     * The compiler configuration for an entry that is already a `File` or a `Directory` — the
     * way to configure for a file whose content lives in memory (see `File.withContent`).
     *
     * A file belongs to the project of the nearest `package.json` above it, wherever it sits
     * (`src/comandos/ping.chord` is part of the project that holds `src/`). Without one, and for
     * a directory, the root is the entry's own directory, or the one that holds it if it is `src`.
     * @param input - The entry: a single script or a whole project.
     * @returns The project layout the entry belongs to.
     */
    static layoutOf(input: File | Directory): CompilerConfig {
        const baseDir = input instanceof Directory ? input : Directory.of(input.directory);
        const enclosing = input instanceof Directory ? undefined : FileSystem.nearestProject(baseDir);
        const projectRoot = enclosing ?? (baseDir.name === FileSystem.SOURCE_DIR ? baseDir.parent : baseDir);

        return {
            input,
            projectRoot,
            distDir: projectRoot.resolve('dist')
        };
    }

    /**
     * The closest directory, from `start` upwards, that holds a `package.json`.
     * @param start - Where to start looking.
     * @returns That directory, or `undefined` if none up to the root of the disk has one.
     */
    private static nearestProject(start: Directory): Directory | undefined {
        let current = start;

        while (!current.hasFile(FileSystem.PROJECT_MANIFEST)) {
            const parent = current.parent;

            if (parent.absolutePath === current.absolutePath) return undefined;

            current = parent;
        }

        return current;
    }

    /**
     * Compiled output is plain `.js` (matching what Seyfert's own command/event file loader
     * recognizes — it only scans for `.js`/`.ts`, never `.mjs`), which only runs as ESM
     * (`import`/`export`) if the project's `package.json` declares `"type": "module"`. Without
     * it, Node would try to run the compiled `.js` files as CommonJS and fail on the first
     * `import` statement — so this is checked once, upfront, with a clear message, instead of
     * letting that surface later as a confusing Node syntax error.
     *
     * Called by `CompileCommand` for a real project compile — not part of `configure()` itself,
     * since the internal test harness (`tester/Test.ts`) also calls `configure()` against bare
     * fixture directories that have no `package.json` of their own and never actually run.
     * @param projectRoot - The project's root directory (where `package.json` is expected).
     * @throws {Error} If `package.json` is missing, unreadable, or lacks `"type": "module"`.
     */
    static assertEsmProject (projectRoot: Directory): void {
        if (!projectRoot.hasFile('package.json')) {
            throw new Error(`No se encontró 'package.json' en '${projectRoot}'. DisChord necesita que el proyecto tenga uno con "type": "module".`);
        }

        const packageJson = projectRoot.file('package.json');

        if (JSON.parse(packageJson.read()).type !== 'module') {
            throw new Error(`El 'package.json' del proyecto necesita "type": "module" para poder ejecutar el código compilado (Seyfert carga los archivos de 'comandos'/'eventos' como .js, y Node solo los trata como ESM con esa opción activada). Añádela en '${packageJson}'.`);
        }
    }

    /**
     * Retrieves every .chord file of a project, or the single file that was asked for.
     *
     * A single file living directly inside a conventional `src/` folder (e.g. `src/index.chord`)
     * is treated as a project's entry point rather than a standalone script: pointing the CLI at
     * just that file — the natural thing to do, since it's the designated entry — would otherwise
     * silently compile only that one file and skip every sibling `.chord` under `src/` (commands,
     * events, ...), with no indication anything was left out. A file that *isn't* inside a `src/`
     * folder (e.g. a standalone script outside any project) keeps the original, literal
     * single-file behavior.
     *
     * With `alone`, a single file is only ever itself: checking `src/index.chord` reports what is
     * wrong with that file, not with a sibling the question was not about.
     * @param input - The entry: a directory, or a single file.
     * @param alone - Whether a single file stands for itself and never for the project around it.
     * @returns Every discovered .chord file.
     * @throws {Error} If a single input is not a `.chord` file.
     */
    static getChordFiles(input: File | Directory, alone: boolean = false): File[] {
        if (input instanceof Directory) return input.files('.chord');

        if (!alone && FileSystem.isProjectCompile(input)) return Directory.of(input.directory).files('.chord');

        if (!input.hasExtension('.chord')) {
            throw new Error(`Se esperaba un archivo .chord: ${input}`);
        }

        return [input];
    }

    /**
     * Whether compiling `input` covers the project's whole `src/` — a directory, or a single
     * file directly inside `src/` (see `getChordFiles`) — as opposed to one standalone script.
     * Only a full project compile knows every file that belongs in `dist/`, so it is the only
     * kind that may delete stale output.
     * @param input - The entry.
     */
    static isProjectCompile(input: File | Directory): boolean {
        return input instanceof Directory || Directory.of(input.directory).name === FileSystem.SOURCE_DIR;
    }
}
