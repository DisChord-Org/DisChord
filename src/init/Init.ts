import * as fs from 'fs';
import path from 'path';

import Prettifier from './Prettifier';
import { ASTNode } from '../chord/types';
import { DisChordNodeType } from '../dischord/types';

import { Lexer } from '../chord/lexer';
import { DisChordParser } from '../dischord/Parser/parser';
import { DisChordGenerator } from '../dischord/Generator/generator';
import { CompilerConfig, FileSystem } from './FileSystem';
import { CLI, LogFlagLevel } from './CLI';
import { Runner } from './Runner';
import { codeProvider } from '../CodeProvider';
import { SymbolTable } from '../chord/SymbolsTable';

/**
 * @interface CompilationContext
 * @description State shared between Parser and Generator.
 */
export interface CompilationContext {
    symbolTable: SymbolTable;
    projectRoot: string;
}

/**
 * Main orchestrator for the DisChord compilation process.
 */
export default class Init {
    private config: CompilerConfig;

    constructor () {
        const rawPath = CLI.validateInput();

        this.config = FileSystem.configure(rawPath);
    }

    /**
     * Entry point that triggers the compilation of all relevant files
     * and executes the resulting code if the --no-run flag is absent.
     */
    async run() {
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
                console.error(error);
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
        console.log(`Compilando: ${path.relative(this.config.projectRoot, file)}`);

        const relativePath = path.relative(path.join(this.config.projectRoot, 'src'), file);
        const fileName = path.basename(file, '.chord');
        const targetDir = path.join(this.config.distDir, path.dirname(relativePath));
        const outputPath = path.join(targetDir, `${fileName}.mjs`);

        const code = fs.readFileSync(file, 'utf-8');

        codeProvider.currentCode = { name: file, content: code };

        DisChordParser.injectStatements();

        const lexer = new Lexer();
        const tokens = lexer.tokenize();
        CLI.logFlag(LogFlagLevel.LEXER, tokens);

        const context: CompilationContext = {
            symbolTable: new SymbolTable(),
            projectRoot: this.config.projectRoot
        };

        const parser = new DisChordParser(tokens, context);
        const ast = parser.parse();
        CLI.logFlag(LogFlagLevel.AST, ast);
    
        const generator = new DisChordGenerator(context);
        const output = generator.generate(ast as ASTNode<DisChordNodeType>[]);
        CLI.logFlag(LogFlagLevel.OUTPUT, output);

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        await Prettifier.savePrettified(outputPath, output);
    }
}
