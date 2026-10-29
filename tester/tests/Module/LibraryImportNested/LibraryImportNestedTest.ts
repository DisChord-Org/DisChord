import path from "node:path";

import { Test } from "../../../Test";
import { Lexer } from "../../../../src/chord/Lexer";
import { CodeProvider } from "../../../../src/chord/CodeProvider";
import { DisChordParser } from "../../../../src/dischord/Parser/Parser";
import { DisChordAnalyzer } from "../../../../src/dischord/Analyzer/Analyzer";
import { DisChordGenerator } from "../../../../src/dischord/Generator/Generator";
import { DisChordASTNode, DisChordNodeType, DisChordTokenType } from "../../../../src/dischord/types";
import { CompilationContext } from "../../../../src/chord/model/CompilationContext";
import { FileSystem } from "../../../../src/utils/FileSystem";
import { DisChordCompilationContext } from "../../../../src/cli/DisChordCompilationContext";

/**
 * @class LibraryImportNestedTest
 * @description Regression test for `importar { x } desde "lib:X"` in a file that lives in a subfolder:
 * the specifier was a fixed `../lib/X/src/index.js`, right one level under `dist/` and wrong any deeper
 * (`dist/a/b.js` asked for `dist/lib/...`, an `ERR_MODULE_NOT_FOUND`). The harness compiles one file at
 * the root of its fixture, so this test compiles the same source as if it were written at two depths and
 * checks the specifier of each.
 */
export class LibraryImportNestedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Library Import Nested - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to resolve 'lib:X' relative to where the importing file is written, at any depth under dist";

    /**
     * Not a snapshot comparison: it compiles the fixture's source with two output directories.
     * @override
     */
    protected override async run (): Promise<void> {
        const config = FileSystem.configure(this.fixturePath);

        this.assertImport(this.generate(config.distDir), '../lib/ent/src/index.js');
        this.assertImport(this.generate(path.join(config.distDir, 'a')), '../../lib/ent/src/index.js');
        this.assertImport(this.generate(path.join(config.distDir, 'a', 'b')), '../../../lib/ent/src/index.js');
    }

    private generate (outputDir: string): string {
        const config = FileSystem.configure(this.fixturePath);
        const context: CompilationContext<DisChordNodeType> = DisChordCompilationContext.create(config, outputDir);

        DisChordParser.registerGrammar(context);
        context.codeProvider.currentCode = { file: this.fixture.file('input.chord'), content: this.code };

        const tokens = new Lexer<DisChordTokenType>(context).tokenize();
        const ast: DisChordASTNode[] = new DisChordParser(tokens, context).parse();

        new DisChordAnalyzer(context).analyze(ast);

        return new DisChordGenerator(context, ast).generate();
    }

    private assertImport (output: string, specifier: string): void {
        const expected = `from "${specifier}"`;

        if (!output.includes(expected)) {
            throw new Error(`Expected the import to be ${expected}, got:\n${output}`);
        }
    }
}
