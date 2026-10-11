import path from 'path';

import { GlobalCLIOptions } from '../Program';
import { CompilerConfig, FileSystem } from '../../utils/FileSystem';
import Prettifier from '../../utils/Prettifier';
import { BaseChordError, Diagnostic } from '../../errors/ChordError';
import { File } from '../../utils/File';
import { Directory } from '../../utils/Directory';
import { FileCompiler } from './FileCompiler';
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
     * Executes the main compilation process and optionally runs the generated code. With `--json`
     * nothing is printed but a single document holding the diagnostics.
     *
     * @param {string} rawPath - Raw path string passed from CLI arguments.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<void>}
     */
    public async execute(rawPath: string, options: GlobalCLIOptions): Promise<void> {
        if (!options.json) return this.compile(rawPath, options);

        const diagnostics: Diagnostic[] = [];

        try {
            await this.compile(rawPath, options);
        } catch (error) {
            diagnostics.push(this.toDiagnostic(error));
            process.exitCode = 1;
        }

        console.log(JSON.stringify({ ok: diagnostics.length === 0, diagnostics }));
    }

    /**
     * Runs the compilation pipeline over every file of the project.
     *
     * @private
     * @param {string} rawPath - Raw path string passed from CLI arguments.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<void>}
     */
    private async compile(rawPath: string, options: GlobalCLIOptions): Promise<void> {
        this.config = FileSystem.configure(rawPath);
        this.emitted.clear();
        FileSystem.assertEsmProject(this.config.projectRoot);

        const files = FileSystem.getChordFiles(this.config.input);

        this.log(options, `Compilando proyecto: ${this.config.projectRoot}`);

        const extraFiles = new Map<string, string>();

        for (const file of files) {
            const fileExtraFiles = await this.compileFile(file, options);
            fileExtraFiles.forEach((content, absolutePath) => extraFiles.set(absolutePath, content));
        }

        if (options.check) return;

        await this.writeExtraFiles(extraFiles);

        this.removeStaleOutputs(options);

        if (options.run) await this.executeTarget();
    }

    /**
     * Compiles a single .chord source file into Javascript and writes it, unless only checking.
     * A compiler error leaves the method tagged with the file it belongs to.
     *
     * @private
     * @param {File} file - The .chord file.
     * @param {GlobalCLIOptions} options - CLI flags for debugging and output control.
     * @returns {Promise<Map<string, string>>} Extra files (shared runtime modules, project-level
     * config files, ...) any phase determined this file's compilation needs written, keyed by
     * absolute path — see `CompilationContext.extraFiles`.
     */
    private async compileFile(file: File, options: GlobalCLIOptions): Promise<Map<string, string>> {
        if (!this.config) return new Map();

        const relativeFile = file.relativeTo(this.config.projectRoot.absolutePath);
        this.log(options, `Compilando: ${relativeFile}`);

        const relativePath = path.relative(this.config.projectRoot.resolve('src'), file.absolutePath);
        const targetDir = options.outDir
            ? path.resolve(options.outDir)
            : path.join(this.config.distDir, path.dirname(relativePath));

        let compiled;

        try {
            compiled = new FileCompiler(options).compile(file, this.config.projectRoot.absolutePath, targetDir);
        } catch (error) {
            if (error instanceof BaseChordError) error.file = file;
            throw error;
        }

        if (options.check) return compiled.extraFiles;

        const outputPath = Directory.create(targetDir).resolve(`${file.baseName}.js`);
        await Prettifier.savePrettified(outputPath, compiled.output);
        this.emitted.add(outputPath);

        return compiled.extraFiles;
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
            await Prettifier.savePrettified(absolutePath, content);
            this.emitted.add(absolutePath);
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
        await runner.execute(runTarget, { projectRoot: projectRoot.absolutePath });
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
