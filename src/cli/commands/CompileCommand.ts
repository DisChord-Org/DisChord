import * as fs from 'fs';
import path from 'path';

import { GlobalCLIOptions } from '../Program';
import { CompilerConfig, FileSystem } from '../../utils/FileSystem';
import Prettifier from '../../utils/Prettifier';
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
     * Executes the main compilation process and optionally runs the generated code.
     *
     * @param {string} rawPath - Raw path string passed from CLI arguments.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<void>}
     */
    public async execute(rawPath: string, options: GlobalCLIOptions): Promise<void> {
        this.config = FileSystem.configure(rawPath);
        this.emitted.clear();
        FileSystem.assertEsmProject(this.config.projectRoot);

        const files = FileSystem.getChordFiles(this.config.inputPath, this.config.isDirectory);

        console.log(`Compilando proyecto: ${this.config.projectRoot}`);

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
     *
     * @private
     * @param {string} file - Absolute path to the .chord file.
     * @param {GlobalCLIOptions} options - CLI flags for debugging and output control.
     * @returns {Promise<Map<string, string>>} Extra files (shared runtime modules, project-level
     * config files, ...) any phase determined this file's compilation needs written, keyed by
     * absolute path — see `CompilationContext.extraFiles`.
     */
    private async compileFile(file: string, options: GlobalCLIOptions): Promise<Map<string, string>> {
        if (!this.config) return new Map();

        const relativeFile = path.relative(this.config.projectRoot, file);
        console.log(`Compilando: ${relativeFile}`);

        const relativePath = path.relative(path.join(this.config.projectRoot, 'src'), file);
        const targetDir = options.outDir
            ? path.resolve(options.outDir)
            : path.join(this.config.distDir, path.dirname(relativePath));

        const compiled = new FileCompiler(options).compile(file, this.config.projectRoot, targetDir);

        if (options.check) return compiled.extraFiles;

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const outputPath = path.join(targetDir, `${path.basename(file, '.chord')}.js`);
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
            if (!fs.existsSync(path.dirname(absolutePath))) {
                fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
            }

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
        if (!FileSystem.isProjectCompile(this.config.inputPath, this.config.isDirectory)) return;

        const { projectRoot, distDir } = this.config;
        const removed = FileSystem.removeStaleOutput(distDir, this.emitted);

        removed.forEach(file => console.log(`Eliminado (sin fuente): ${path.relative(projectRoot, file)}`));
    }

    /**
     * Triggers the execution of the output bundle via Runner.
     *
     * @private
     * @returns {Promise<void>}
     */
    private async executeTarget(): Promise<void> {
        if (!this.config) return;

        const runTarget = this.config.isDirectory
            ? path.join(this.config.distDir, 'index.js')
            : path.join(this.config.distDir, `${path.basename(this.config.inputPath, '.chord')}.js`);

        const runner = new RunCommand();
        await runner.execute(runTarget, { projectRoot: this.config.projectRoot });
    }
}
