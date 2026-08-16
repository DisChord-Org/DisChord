import fs from 'fs';
import path from 'path';

/**
 * Global configuration contract for the compiler's environment.
 */
export interface CompilerConfig {
    inputPath: string;      // The entry path
    projectRoot: string;    // The project root (where the dist directory is located)
    distDir: string;        // Output path for the compiled .js files
    isDirectory: boolean;   // Are we compiling an entire project or a single script?
}

/**
 * Static utility class for filesystem operations and path resolution.
 */
export class FileSystem {
    /**
     * Initializes the compiler configuration by analyzing the input path.
     * * @param rawInput - The raw string path received from the CLI.
     * @returns A validated CompilerConfig object with normalized absolute paths.
     * @throws Will throw an error if the path does not exist.
     */
    static configure(rawInput: string): CompilerConfig {
        const inputPath = path.resolve(rawInput);
        const isDirectory = fs.statSync(inputPath).isDirectory();

        const baseDir = isDirectory ? inputPath : path.dirname(inputPath);
        const projectRoot = path.basename(baseDir) === 'src' ? path.join(baseDir, '..') : baseDir;

        return {
            inputPath,
            projectRoot,
            distDir: path.join(projectRoot, 'dist'),
            isDirectory
        };
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
    static assertEsmProject (projectRoot: string): void {
        const packageJsonPath = path.join(projectRoot, 'package.json');

        if (!fs.existsSync(packageJsonPath)) {
            throw new Error(`No se encontró 'package.json' en '${projectRoot}'. DisChord necesita que el proyecto tenga uno con "type": "module".`);
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        if (packageJson.type !== 'module') {
            throw new Error(`El 'package.json' del proyecto necesita "type": "module" para poder ejecutar el código compilado (Seyfert carga los archivos de 'comandos'/'eventos' como .js, y Node solo los trata como ESM con esa opción activada). Añádela en '${packageJsonPath}'.`);
        }
    }

    /**
     * Recursively retrieves all .chord files from a directory or returns the single file path.
     *
     * A single file living directly inside a conventional `src/` folder (e.g. `src/index.chord`)
     * is treated as a project's entry point rather than a standalone script: pointing the CLI at
     * just that file — the natural thing to do, since it's the designated entry — would otherwise
     * silently compile only that one file and skip every sibling `.chord` under `src/` (commands,
     * events, ...), with no indication anything was left out. A file that *isn't* inside a `src/`
     * folder (e.g. one of the standalone scripts under `examples/`) keeps the original, literal
     * single-file behavior.
     * @param dir - The starting directory or file path.
     * @param isDirectory - Boolean flag to determine search mode.
     * @returns An array of absolute paths to all discovered .chord files.
     */
    static getChordFiles(dir: string, isDirectory: boolean): string[] {
        if (!isDirectory) {
            const parentDir = path.dirname(dir);
            if (path.basename(parentDir) === 'src') return FileSystem.getChordFiles(parentDir, true);

            return [dir];
        }

        return FileSystem.walkChordFiles(dir);
    }

    /**
     * Manually walks a directory tree collecting `.chord` files, rather than relying on
     * `fs.readdirSync`'s `recursive` option (only available from Node 20.1 onward, and silently
     * ignored — not an error — on older runtimes, which would quietly turn this into a shallow,
     * non-recursive scan).
     * @private
     * @param dir - The directory to walk.
     * @returns An array of absolute paths to every `.chord` file found under `dir`.
     */
    private static walkChordFiles (dir: string): string[] {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        return entries.flatMap(entry => {
            const entryPath = path.join(dir, entry.name);

            if (entry.isDirectory()) return FileSystem.walkChordFiles(entryPath);
            if (entry.isFile() && entry.name.endsWith('.chord')) return [entryPath];

            return [];
        });
    }

    /**
     * Determines the root of the project based on the location of the source files.
     * * @param inputPath - The current working path.
     * @param isDirectory - Boolean flag of the input type.
     * @returns The absolute path to the project's root directory.
     * @deprecated
     */
    static resolveProjectRoot(inputPath: string, isDirectory: boolean): string {
        const dir = isDirectory ? inputPath : path.dirname(inputPath);
        return path.basename(dir) === 'src' ? path.join(dir, '..') : dir;
    }
}