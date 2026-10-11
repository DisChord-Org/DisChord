import path from 'path';

import { EmitKind, GlobalCLIOptions } from '../Program';
import { CompilerConfig, FileSystem } from '../../utils/FileSystem';
import Prettifier from '../../utils/Prettifier';
import { BaseChordError, Diagnostic } from '../../errors/ChordError';
import { File } from '../../utils/File';
import { Stdin } from '../../utils/Stdin';
import { Directory } from '../../utils/Directory';
import { ExitCode } from '../ExitCode';
import { FileCompiler, FileCompilation } from './FileCompiler';
import { Location } from '../../chord/types';
import { RunCommand } from './RunCommand';

/**
 * Command handler responsible for orchestrating project compilation and execution.
 *
 * @class CompileCommand
 */
export class CompileCommand {
    /** Resolved filesystem and output paths configuration */
    private config: CompilerConfig | null = null;

    /** Absolute paths of every file written during the current compile, see `removeStaleOutputs` */
    private emitted = new Set<string>();

    /**
     * Version of the document `--emit` prints. Adding keys does not change it; renaming or
     * removing one, or changing what it means, does. The shape of the nodes of an `ast` is the
     * compiler's own and is not covered by it.
     */
    public static readonly emitSchema = 1;

    /**
     * Executes the main compilation process and optionally runs the generated code. With `--json`
     * nothing is printed but a single document holding the diagnostics (and, with `--emit`, what
     * was asked to be emitted).
     *
     * @param {string} rawPath - Raw path string passed from CLI arguments.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<void>}
     */
    public async execute(rawPath: string, options: GlobalCLIOptions): Promise<void> {
        if (options.emit) options = { ...options, json: true, check: true };

        if (!options.json) {
            await this.compile(rawPath, options);
            return;
        }

        const diagnostics: Diagnostic[] = [];
        let emitted: object | undefined;

        try {
            emitted = await this.compile(rawPath, options);
        } catch (error) {
            diagnostics.push(this.toDiagnostic(error));
            process.exitCode = ExitCode.of(error);
        }

        console.log(JSON.stringify({ ok: diagnostics.length === 0, diagnostics, ...emitted }));
    }

    /**
     * Runs the compilation pipeline over every file of the project.
     *
     * @private
     * @param {string} rawPath - Raw path string passed from CLI arguments.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<object | undefined>} What `--emit` asked for, if it did.
     */
    private async compile(rawPath: string, options: GlobalCLIOptions): Promise<object | undefined> {
        const stdinFile = options.stdin ? await this.readStdinFile(options) : undefined;

        if (stdinFile) options = { ...options, check: true };

        this.config = stdinFile ? FileSystem.layoutOf(stdinFile) : FileSystem.configure(rawPath);
        this.emitted.clear();

        if (options.emit) return this.emit(stdinFile ?? this.singleFile(this.config), options.emit, options);

        FileSystem.assertEsmProject(this.config.projectRoot);

        const files = stdinFile ? [stdinFile] : FileSystem.getChordFiles(this.config.input);

        this.log(options, `Compilando proyecto: ${this.config.projectRoot}`);

        const extraFiles = new Map<string, string>();
        const extraDirectories = new Set<string>();

        for (const file of files) {
            const compiled = await this.compileFile(file, options);
            compiled.extraFiles.forEach((content, absolutePath) => extraFiles.set(absolutePath, content));
            compiled.extraDirectories.forEach(directory => extraDirectories.add(directory));
        }

        if (options.check) return undefined;

        await this.writeExtraFiles(extraFiles);

        this.removeStaleOutputs(options);

        // after the cleanup, which also drops directories left empty
        extraDirectories.forEach(directory => Directory.create(directory));

        if (options.run) await this.executeTarget();

        return undefined;
    }

    /**
     * Compiles a single .chord source file into Javascript and writes it, unless only checking.
     * A compiler error leaves the method tagged with the file it belongs to.
     *
     * @private
     * @param {File} file - The .chord file.
     * @param {GlobalCLIOptions} options - CLI flags for debugging and output control.
     * @returns {Promise<FileCompilation>} What the compilation produced, including the extra files
     * and directories (shared runtime modules, project-level config files, ...) any phase
     * determined it needs — see `CompilationContext.extraFiles`.
     */
    private async compileFile(file: File, options: GlobalCLIOptions): Promise<FileCompilation> {
        if (!this.config) return { output: '', extraFiles: new Map(), extraDirectories: new Set() };

        const relativeFile = file.relativeTo(this.config.projectRoot.absolutePath);
        this.log(options, `Compilando: ${relativeFile}`);

        const relativePath = path.relative(this.config.projectRoot.resolve('src'), file.absolutePath);
        const targetDir = options.outDir
            ? path.resolve(options.outDir)
            : path.join(this.config.distDir, path.dirname(relativePath));

        let compiled;

        try {
            compiled = new FileCompiler(options).compile(file, this.config, targetDir);
        } catch (error) {
            if (error instanceof BaseChordError) error.file = file;
            throw error;
        }

        if (options.check) return compiled;

        const written = await Prettifier.savePrettified(Directory.create(targetDir).resolve(`${file.baseName}.js`), compiled.output);
        this.emitted.add(written.absolutePath);

        return compiled;
    }

    /**
     * The one file `--emit` is about when it does not come through `--stdin`.
     *
     * @private
     * @param {CompilerConfig} config - The configuration for the entry.
     * @returns {File}
     * @throws {Error} If the entry is a directory.
     */
    private singleFile(config: CompilerConfig): File {
        if (config.input instanceof Directory) {
            throw new Error('--emit trabaja sobre un único archivo .chord, no sobre un directorio');
        }

        return config.input;
    }

    /**
     * Runs only the phase `--emit` asks for over a file and describes what it produced. Nothing
     * is analyzed, generated or written.
     *
     * @private
     * @param {File} file - The file to emit.
     * @param {EmitKind} kind - The phase to stop at.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {object} The keys the document gains.
     */
    private emit(file: File, kind: EmitKind, options: GlobalCLIOptions): object {
        const config = this.config!;
        const compiler = new FileCompiler(options);

        try {
            if (kind === 'tokens') {
                const tokens = compiler.tokenize(file, config, config.distDir).map(token => ({
                    type: token.type,
                    value: token.value,
                    start: token.location as Location,
                    end: token.end
                }));

                return { schema: CompileCommand.emitSchema, emit: kind, file: file.absolutePath, tokens };
            }

            return {
                schema: CompileCommand.emitSchema,
                emit: kind, file: file.absolutePath,
                ...compiler.parseTree(file, config, config.distDir)
            };
        } catch (error) {
            if (error instanceof BaseChordError) error.file = file;
            throw error;
        }
    }

    /**
     * The file a `--stdin` check is about: the path `--stdin-filepath` names, with the content
     * read from standard input. The path need not exist yet (a buffer that was never saved), but
     * the directory it lives in must, so imports and the project can be resolved from it.
     *
     * @private
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<File>}
     * @throws {Error} If `--stdin-filepath` is missing or does not name a `.chord` file.
     */
    private async readStdinFile(options: GlobalCLIOptions): Promise<File> {
        if (!options.stdinFilepath) throw new Error('--stdin necesita --stdin-filepath <ruta> con el archivo al que corresponde el código');

        const file = File.withContent(options.stdinFilepath, await Stdin.read());

        if (!file.hasExtension('.chord')) {
            throw new Error(`--stdin-filepath debe ser un archivo .chord: ${file}`);
        }

        return file;
    }

    /**
     * Writes out whatever extra files any phase determined the compiled project needs (see
     * `CompilationContext.extraFiles`) — shared runtime modules, project-level config files,
     * anything. Purely generic: writes absolute path/content pairs without knowing what any of
     * them are for or which phase asked for them — that's each rule/visitor's own concern.
     *
     * @private
     * @param {Map<string, string>} files - Content keyed by absolute output path.
     * @returns {Promise<void>}
     */
    private async writeExtraFiles(files: Map<string, string>): Promise<void> {
        for (const [absolutePath, content] of files) {
            Directory.create(path.dirname(absolutePath));
            const written = await Prettifier.savePrettified(absolutePath, content);
            this.emitted.add(written.absolutePath);
        }
    }

    /**
     * Deletes files left in `dist/` by a previous compile whose `.chord` source has since been
     * removed. Runs only after every file compiled successfully, so a
     * failed compile never deletes anything, and only for a full project compile writing to the
     * default `dist/`: a standalone script or a custom `--out-dir` doesn't know the complete set
     * of files that belong there.
     *
     * @private
     * @param {GlobalCLIOptions} options - CLI flags; `outDir` disables cleanup.
     */
    private removeStaleOutputs(options: GlobalCLIOptions): void {
        if (!this.config || options.outDir) return;
        if (!FileSystem.isProjectCompile(this.config.input)) return;

        const { projectRoot, distDir } = this.config;
        const removed = Directory.tryOf(distDir)?.removeFilesExcept('.js', this.emitted) ?? [];

        removed.forEach(file => this.log(options, `Eliminado (sin fuente): ${path.relative(projectRoot.absolutePath, file)}`));
    }

    /**
     * Triggers the execution of the output bundle via Runner.
     *
     * @private
     * @returns {Promise<void>}
     */
    private async executeTarget(): Promise<void> {
        if (!this.config) return;

        const { input, distDir, projectRoot } = this.config;
        const runTarget = path.join(distDir, input instanceof Directory ? 'index.js' : `${input.baseName}.js`);

        const runner = new RunCommand();
        await runner.execute(runTarget, { projectRoot });
    }

    /**
     * Converts whatever a failed compilation threw into a diagnostic. A compiler error carries its
     * own; anything else is a failure of the tool itself (missing project, unreadable file, ...).
     *
     * @private
     * @param {unknown} error - The thrown value.
     * @returns {Diagnostic}
     */
    private toDiagnostic(error: unknown): Diagnostic {
        if (error instanceof BaseChordError) return error.toDiagnostic();

        return {
            phase: 'Interno',
            severity: 'error',
            message: error instanceof Error ? error.message : String(error)
        };
    }

    /**
     * Prints a progress message unless the output is machine-readable (`--json`).
     *
     * @private
     * @param {GlobalCLIOptions} options - Active CLI options.
     * @param {string} message - Message to print.
     */
    private log(options: GlobalCLIOptions, message: string): void {
        if (!options.json) console.log(message);
    }
}
