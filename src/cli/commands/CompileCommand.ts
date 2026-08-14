import * as fs from 'fs';
import path from 'path';

import { GlobalCLIOptions, DebugFlags } from '../Program';
import { CompilerConfig, FileSystem } from '../../utils/FileSystem';
import Prettifier from '../../utils/Prettifier';
import { CodeProvider } from '../../chord/CodeProvider';
import { SymbolTable } from '../../chord/SymbolsTable';
import { KeyWords } from '../../chord/KeywordsManager';
import { Lexer } from '../../chord/Lexer';
import { DisChordParser } from '../../dischord/Parser/Parser';
import { DisChordGenerator } from '../../dischord/Generator/Generator';
import { DisChordASTNode, DisChordNodeType, DisChordTokenType } from '../../dischord/types';
import { RunCommand } from './RunCommand';

/**
 * Shared state context passed through compiler pipeline phases.
 * 
 * @interface CompilationContext
 * @template T
 */
export interface CompilationContext<T extends string = string> {
    symbolTable: SymbolTable;
    keywordsManager: KeyWords<T>;
    codeProvider: CodeProvider;
    projectRoot: string;
}

/**
 * Command handler responsible for orchestrating project compilation and execution.
 * 
 * @class CompileCommand
 */
export class CompileCommand {
    /** Resolved filesystem and output paths configuration */
    private config: CompilerConfig | null = null;

    /**
     * Executes the main compilation process and optionally runs the generated code.
     * 
     * @param {string} rawPath - Raw path string passed from CLI arguments.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {Promise<void>}
     */
    public async execute(rawPath: string, options: GlobalCLIOptions): Promise<void> {
        this.config = FileSystem.configure(rawPath);

        const files = FileSystem.getChordFiles(this.config.inputPath, this.config.isDirectory);

        console.log(`Compilando proyecto: ${this.config.projectRoot}`);

        const sharedModules = new Map<string, string>();

        for (const file of files) {
            const fileSharedModules = await this.compileFile(file, options);
            fileSharedModules.forEach((content, relativePath) => sharedModules.set(relativePath, content));
        }

        await this.writeSharedModules(sharedModules);

        if (options.run) await this.executeTarget();
    }

    /**
     * Compiles a single .chord source file into Javascript.
     *
     * @private
     * @param {string} file - Absolute path to the .chord file.
     * @param {GlobalCLIOptions} options - CLI flags for debugging and output control.
     * @returns {Promise<Map<string, string>>} Shared runtime modules this file's generator reported needing (see `Generator.sharedModules`).
     */
    private async compileFile(file: string, options: GlobalCLIOptions): Promise<Map<string, string>> {
        if (!this.config) return new Map();

        console.log(`Compilando: ${path.relative(this.config.projectRoot, file)}`);

        const relativePath = path.relative(path.join(this.config.projectRoot, 'src'), file);
        const fileName = path.basename(file, '.chord');
        const targetDir = options.outDir
            ? path.resolve(options.outDir)
            : path.join(this.config.distDir, path.dirname(relativePath));

        const outputPath = path.join(targetDir, `${fileName}.mjs`);

        const context: CompilationContext<DisChordNodeType> = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: this.config.projectRoot
        };

        DisChordParser.registerGrammar(context);

        const code = fs.readFileSync(file, 'utf-8');
        context.codeProvider.currentCode = { name: file, content: code };

        const lexer = new Lexer<DisChordTokenType>(context);
        const tokens = lexer.tokenize();
        this.logDebug(DebugFlags.Lexer, options, tokens);

        const parser = new DisChordParser(tokens, context);
        const ast: DisChordASTNode[] = parser.parse();
        this.logDebug(DebugFlags.Parser, options, ast);

        const generator = new DisChordGenerator(context);
        const output = generator.generate(ast);
        this.logDebug(DebugFlags.Generator, options, output);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        await Prettifier.savePrettified(outputPath, output);

        return generator.sharedModules();
    }

    /**
     * Writes out whatever shared runtime modules the compiled files reported needing (see
     * `Generator.sharedModules`). Purely generic: writes path/content pairs relative to `dist/`
     * without knowing what any of them are for — that's each dialect's own concern.
     *
     * @private
     * @param {Map<string, string>} modules - Content keyed by output path relative to `dist/`.
     * @returns {Promise<void>}
     */
    private async writeSharedModules(modules: Map<string, string>): Promise<void> {
        if (!this.config) return;

        for (const [relativePath, content] of modules) {
            const modulePath = path.join(this.config.distDir, relativePath);

            if (!fs.existsSync(path.dirname(modulePath))) {
                fs.mkdirSync(path.dirname(modulePath), { recursive: true });
            }

            await Prettifier.savePrettified(modulePath, content);
        }
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
            ? path.join(this.config.distDir, 'index.mjs')
            : path.join(this.config.distDir, `${path.basename(this.config.inputPath, '.chord')}.mjs`);

        const runner = new RunCommand();
        await runner.execute(runTarget, { projectRoot: this.config.projectRoot });
    }

    /**
     * Inspects and logs internal data structures according to the active debug flag and depth.
     * 
     * @private
     * @param {DebugFlags} phase - The phase associated with the current data.
     * @param {GlobalCLIOptions} options - Active CLI options.
     * @param {unknown} data - Data structure to print.
     */
    private logDebug(phase: DebugFlags, options: GlobalCLIOptions, data: unknown): void {
        if (options.debug === undefined) return;

        if (options.debug === DebugFlags.All || options.debug === phase) {
            console.dir(data, { depth: options.depth, colors: true });
        }
    }
}