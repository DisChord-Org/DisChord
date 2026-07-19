import * as fs from 'fs';
import path from 'path';

import Prettifier from './Prettifier';
import { DisChordASTNode, DisChordNodeType, DisChordTokenType } from '../dischord/types';

import { Lexer } from '../chord/Lexer';
import { DisChordParser } from '../dischord/Parser/Parser';
import { DisChordGenerator } from '../dischord/Generator/Generator';
import { CompilerConfig, FileSystem } from './FileSystem';
import { CLI, LogFlagLevel } from './CLI';
import { Runner } from './Runner';
import { CodeProvider } from '../CodeProvider';
import { SymbolTable } from '../chord/SymbolsTable';
import { KeyWords } from '../chord/KeywordsManager';
import { DisChordError, ErrorLevel } from '../ChordError';
import { Tester } from '../../tester/Tester';

/**
 * @interface CompilationContext
 * @description State shared between Parser and Generator.
 */
export interface CompilationContext <T extends string = string> {
    symbolTable: SymbolTable;
    keywordsManager: KeyWords<T>;
    codeProvider: CodeProvider;
    projectRoot: string;
}

/**
 * Main orchestrator for the DisChord compilation process.
 */
export default class Init {
    /**
     * @type {CompilerConfig | null} Holds the absolute routes and flags configuration if an input is loaded.
     * @private
     */
    private config: CompilerConfig | null = null;

    /**
     * Entry point that triggers the compilation of all relevant files
     * and executes the resulting code if the --no-run flag is absent.
     */
    async run() {
        if (CLI.hasFlag(LogFlagLevel.TEST)) {
            new Tester().testAll();
            return;
        }
        
        const rawPath = CLI.validateInput();
        this.config = FileSystem.configure(rawPath);

        const files = FileSystem.getChordFiles(this.config.inputPath, this.config.isDirectory);
        
        console.log(`Compilando proyecto: ${this.config.projectRoot}`);

        for (const file of files) {
            await this.compile(file).catch(error => {
                console.error(error);
                process.exit(1);
            });
        }

        if (!CLI.hasFlag(LogFlagLevel.NORUN)) {
            const runTarget = this.config.isDirectory
                ? path.join(this.config.distDir, 'index.mjs')
                : path.join(this.config.distDir, `${path.basename(this.config.inputPath, '.chord')}.mjs`);

            console.log(`Ejecutando: ${path.relative(this.config.projectRoot, runTarget)}\n`);

            Runner.execute(runTarget, this.config.projectRoot).catch(error => {
                console.error(new DisChordError({
                    phase: ErrorLevel.Execution,
                    message: error instanceof Error ? error.message : String(error),
                    location: error instanceof Error && error.stack ? { 
                        line: 0,
                        column: 0
                    } : undefined
                }).format());

                process.exit(1);
            });
        }
    }

    /**
     * Executes the compilation pipeline for a single .chord file.
     * @param file - Full path to the source file.
     * @returns The path to the generated .mjs file.
     */
    async compile(file: string) {
        if (!this.config) return;

        console.log(`Compilando: ${path.relative(this.config.projectRoot, file)}`);

        const relativePath = path.relative(path.join(this.config.projectRoot, 'src'), file);
        const fileName = path.basename(file, '.chord');
        const targetDir = path.join(this.config.distDir, path.dirname(relativePath));
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
        CLI.logFlag(LogFlagLevel.LEXER, tokens);

        const parser = new DisChordParser(tokens, context);
        const ast: DisChordASTNode[] = parser.parse();
        CLI.logFlag(LogFlagLevel.PARSER, ast);
    
        const generator = new DisChordGenerator(context);
        const output = generator.generate(ast);
        CLI.logFlag(LogFlagLevel.GENERATOR, output);

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        await Prettifier.savePrettified(outputPath, output);
    }
}
