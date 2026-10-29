import { GlobalCLIOptions, DebugFlags } from '../Program';
import { CompilerConfig } from '../../utils/FileSystem';
import { CompilationContext } from '../../chord/model/CompilationContext';
import { File } from '../../utils/File';
import { CodeProvider } from '../../chord/CodeProvider';
import { Lexer } from '../../chord/Lexer';
import { DeclaredName, Token } from '../../chord/model/types';
import { DisChordParser } from '../../dischord/Parser/Parser';
import { DisChordAnalyzer } from '../../dischord/Analyzer/Analyzer';
import { DisChordGenerator } from '../../dischord/Generator/Generator';
import { DisChordASTNode, DisChordNodeType, DisChordTokenType } from '../../dischord/types';
import { DisChordCompilationContext } from "../DisChordCompilationContext";

/** What compiling one source file produces. */
export interface FileCompilation {
    /** The generated JavaScript, before formatting. */
    output: string;
    /** Extra files (shared runtime modules, project-level config files, ...) the file's compilation needs written. */
    extraFiles: Map<string, string>;
    /** Directories (absolute paths) the compiled project needs to exist. */
    extraDirectories: Set<string>;
}

/**
 * Runs the compiler pipeline (lexer, parser, analyzer, generator) over a single `.chord` file.
 * It reads the source and returns the result; where that result is written, and whether the file
 * belongs to a project, is the caller's concern. Each phase can also be run on its own, for the
 * tools that only need its output.
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
     * @param {File} file - The .chord file.
     * @param {CompilerConfig} config - Layout of the project the file belongs to.
     * @param {string} outputDir - Directory its output will be written to.
     * @returns {FileCompilation} The generated code and the extra files it needs.
     */
    public compile(file: File, config: CompilerConfig, outputDir: string): FileCompilation {
        const context = this.createContext(file, config, outputDir);

        const tokens = this.lex(context);
        const ast = this.parse(context, tokens);

        new DisChordAnalyzer(context).analyze(ast);

        const output = new DisChordGenerator(context, ast).generate();
        this.logDebug(DebugFlags.Generator, output);

        return { output, extraFiles: context.extraFiles, extraDirectories: context.extraDirectories };
    }

    /**
     * Runs the lexer alone over a source file.
     *
     * @param {File} file - The .chord file.
     * @param {CompilerConfig} config - Layout of the project the file belongs to.
     * @param {string} outputDir - Directory its output would be written to.
     * @returns {Token<DisChordTokenType>[]} The tokens, each with where it starts and ends.
     */
    public tokenize(file: File, config: CompilerConfig, outputDir: string): Token<DisChordTokenType>[] {
        return this.lex(this.createContext(file, config, outputDir));
    }

    /**
     * Runs the lexer and the parser over a source file, without analyzing it.
     *
     * @param {File} file - The .chord file.
     * @param {CompilerConfig} config - Layout of the project the file belongs to.
     * @param {string} outputDir - Directory its output would be written to.
     * @returns {{ ast: DisChordASTNode[]; declarations: readonly DeclaredName[] }} The syntax tree,
     * and every name the source declares with where it is written.
     */
    public parseTree(file: File, config: CompilerConfig, outputDir: string): { ast: DisChordASTNode[]; declarations: readonly DeclaredName[] } {
        const context = this.createContext(file, config, outputDir);
        const parser = new DisChordParser(this.lex(context), context);
        const ast: DisChordASTNode[] = parser.parse();

        this.logDebug(DebugFlags.Parser, ast);

        return { ast, declarations: parser.declarations.entries() };
    }

    /**
     * A compilation context for the file, with the grammar registered and its code loaded.
     *
     * @private
     * @param {File} file - The .chord file.
     * @param {CompilerConfig} config - Layout of the project the file belongs to.
     * @param {string} outputDir - Directory its output will be written to.
     * @returns {CompilationContext<DisChordNodeType>}
     */
    private createContext(file: File, config: CompilerConfig, outputDir: string): CompilationContext<DisChordNodeType> {
        const context: CompilationContext<DisChordNodeType> = DisChordCompilationContext.create(config, outputDir);

        DisChordParser.registerGrammar(context);

        context.codeProvider.currentCode = { file, content: file.read() };

        return context;
    }

    private lex(context: CompilationContext<DisChordNodeType>): Token<DisChordTokenType>[] {
        const tokens = new Lexer<DisChordTokenType>(context).tokenize();
        this.logDebug(DebugFlags.Lexer, tokens);

        return tokens;
    }

    private parse(context: CompilationContext<DisChordNodeType>, tokens: Token<DisChordTokenType>[]): DisChordASTNode[] {
        const ast: DisChordASTNode[] = new DisChordParser(tokens, context).parse();
        this.logDebug(DebugFlags.Parser, ast);

        return ast;
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
