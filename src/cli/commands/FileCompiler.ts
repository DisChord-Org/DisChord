import * as fs from 'fs';

import { GlobalCLIOptions, DebugFlags } from '../Program';
import { CompilationContext } from '../../chord/model/CompilationContext';
import { SymbolTable } from '../../chord/model/SymbolsTable';
import { CodeProvider } from '../../chord/CodeProvider';
import { KeyWords } from '../../chord/KeywordsManager';
import { Lexer } from '../../chord/Lexer';
import { disChordCoreLibUtils, disChordCoreLibDispatch } from '../../dischord/corelib';
import { DisChordParser } from '../../dischord/Parser/Parser';
import { DisChordAnalyzer } from '../../dischord/Analyzer/Analyzer';
import { DisChordGenerator } from '../../dischord/Generator/Generator';
import { DisChordASTNode, DisChordNodeType, DisChordTokenType } from '../../dischord/types';

/** What compiling one source file produces. */
export interface FileCompilation {
    /** The generated JavaScript, before formatting. */
    output: string;
    /** Extra files (shared runtime modules, project-level config files, ...) the file's compilation needs written. */
    extraFiles: Map<string, string>;
}

/**
 * Runs the compiler pipeline (lexer, parser, analyzer, generator) over a single `.chord` file.
 * It reads the source and returns the result; where that result is written, and whether the file
 * belongs to a project, is the caller's concern.
 *
 * @class FileCompiler
 */
export class FileCompiler {
    /**
     * @param {GlobalCLIOptions} options - CLI flags; only the debug ones matter here.
     */
    constructor(private readonly options: GlobalCLIOptions) {}

    /**
     * Compiles a single source file.
     *
     * @param {string} file - Absolute path to the .chord file.
     * @param {string} projectRoot - Root of the project the file belongs to.
     * @param {string} outputDir - Directory its output will be written to.
     * @returns {FileCompilation} The generated code and the extra files it needs.
     */
    public compile(file: string, projectRoot: string, outputDir: string): FileCompilation {
        const context: CompilationContext<DisChordNodeType> = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot,
            outputDir,
            extraFiles: new Map(),
            coreLib: disChordCoreLibUtils,
            coreLibDispatch: disChordCoreLibDispatch
        };

        DisChordParser.registerGrammar(context);

        const code = fs.readFileSync(file, 'utf-8');
        context.codeProvider.currentCode = { name: file, content: code };

        const lexer = new Lexer<DisChordTokenType>(context);
        const tokens = lexer.tokenize();
        this.logDebug(DebugFlags.Lexer, tokens);

        const parser = new DisChordParser(tokens, context);
        const ast: DisChordASTNode[] = parser.parse();
        this.logDebug(DebugFlags.Parser, ast);

        new DisChordAnalyzer(context).analyze(ast);

        const output = new DisChordGenerator(context, ast).generate();
        this.logDebug(DebugFlags.Generator, output);

        return { output, extraFiles: context.extraFiles };
    }

    /**
     * Inspects and logs internal data structures according to the active debug flag and depth.
     *
     * @private
     * @param {DebugFlags} phase - The phase associated with the current data.
     * @param {unknown} data - Data structure to print.
     */
    private logDebug(phase: DebugFlags, data: unknown): void {
        if (this.options.debug === undefined) return;

        if (this.options.debug === DebugFlags.All || this.options.debug === phase) {
            console.dir(data, { depth: this.options.depth, colors: true });
        }
    }
}
