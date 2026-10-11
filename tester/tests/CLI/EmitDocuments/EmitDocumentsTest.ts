import fs from "node:fs";
import path from "node:path";

import { Test } from "../../../Test";
import { Program } from "../../../../src/cli/Program";

interface Position { line: number; column: number }
interface EmittedToken { type: string; value: string; start: Position; end: Position }
interface Emitted {
    ok: boolean;
    diagnostics: { phase: string; message: string; line?: number; column?: number; file?: string }[];
    schema?: number;
    emit?: string;
    file?: string;
    tokens?: EmittedToken[];
    ast?: { type: string }[];
}

/**
 * @class EmitDocumentsTest
 * @description Validates what `--emit tokens|ast` prints: tokens whose start and end delimit exactly the text they were read from, a syntax tree without analyzing it, and the diagnostics document of the failing phase.
 */
export class EmitDocumentsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Emit Documents - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit the tokens and the syntax tree of a file as JSON";

    /**
     * Not a comparison with a snapshot: it runs the CLI over fixture files and inspects what it prints.
     * @override
     */
    protected override async run (): Promise<void> {
        const input = path.join(this.fixturePath, 'input.chord');
        const source = fs.readFileSync(input, 'utf-8');

        this.assertTokens(await this.emit(input, 'tokens'), source);
        this.assertTree(await this.emit(input, 'ast'));

        // The tree is the parser's: a program that fails the analysis still has one
        const analysis = await this.emit(path.join(this.fixturePath, 'analysis.chord'), 'ast');
        if (!analysis.ok || !analysis.ast?.length) throw new Error('A program that fails the analysis has no syntax tree');

        // A failing phase gives the usual diagnostics document, with where and in which file
        const lexer = await this.emit(path.join(this.fixturePath, 'lexer.chord'), 'tokens');
        if (lexer.ok || lexer.diagnostics.length !== 1) throw new Error('A lexical error should give one diagnostic');
        if (lexer.diagnostics[0].phase !== 'Lexer' || lexer.diagnostics[0].line !== 1) throw new Error('The lexical error has no position');
        if (path.basename(lexer.diagnostics[0].file ?? '') !== 'lexer.chord') throw new Error('The diagnostic does not name the file');
        if (lexer.tokens !== undefined) throw new Error('A failed emission should carry no tokens');

        // Several files: it is about one
        const directory = await this.emit(this.fixturePath, 'tokens');
        if (directory.ok || directory.diagnostics[0].phase !== 'Interno') throw new Error('A directory should be refused');
    }

    /**
     * Runs the CLI with `--emit` over a path and answers the document it printed.
     */
    private async emit (target: string, kind: string): Promise<Emitted> {
        const printed: string[] = [];
        const original = console.log;
        const previousExitCode = process.exitCode;

        console.log = (...args: unknown[]) => { printed.push(args.join(' ')); };

        try {
            await new Program().parse(['node', 'dischord', target, '--emit', kind]);
        } finally {
            console.log = original;
            process.exitCode = previousExitCode;
        }

        if (printed.length !== 1) throw new Error(`--emit printed ${printed.length} lines`);

        return JSON.parse(printed[0]);
    }

    /**
     * Every token spans exactly the text it was read from: its start and end are positions of the source.
     */
    private assertTokens (document: Emitted, source: string): void {
        if (!document.ok || document.emit !== 'tokens' || document.schema !== 1) throw new Error('The tokens document is malformed');
        if (!document.tokens || document.tokens.length === 0) throw new Error('No tokens were emitted');

        const lines = source.split('\n');
        const offsetOf = (position: Position): number => {
            let offset = 0;

            for (let line = 1; line < position.line; line++) offset += lines[line - 1].length + 1;

            return offset + position.column - 1;
        };

        document.tokens.forEach(token => {
            const text = source.slice(offsetOf(token.start), offsetOf(token.end));
            const expected = token.type === 'TEXTO' ? `"${token.value}"` : token.value;

            if (text !== expected) throw new Error(`Token ${token.type} ${JSON.stringify(token.value)} spans ${JSON.stringify(text)}`);
        });

        const texto = document.tokens.find(token => token.type === 'TEXTO');
        if (texto?.start.line !== 3 || texto.end.line !== 3) throw new Error('The text token is not on line 3');

        // Order and no overlap: each token ends where the next one cannot start before
        document.tokens.slice(1).forEach((token, index) => {
            if (offsetOf(token.start) < offsetOf(document.tokens![index].end)) throw new Error(`Token ${token.value} overlaps the previous one`);
        });
    }

    private assertTree (document: Emitted): void {
        if (!document.ok || document.emit !== 'ast' || document.schema !== 1) throw new Error('The tree document is malformed');

        const types = (document.ast ?? []).map(node => node.type).join();
        if (types !== 'Variable,Llamada,funcion,Llamada') throw new Error(`The tree has the nodes ${types}`);
    }
}
