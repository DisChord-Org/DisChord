import path from "node:path";
import fs from "node:fs";

import { DisChordGenerator } from "../src/dischord/Generator/Generator";
import { KeyWords } from "../src/chord/KeywordsManager";
import { Lexer } from "../src/chord/Lexer";
import { DisChordParser } from "../src/dischord/Parser/Parser";
import { DisChordAnalyzer } from "../src/dischord/Analyzer/Analyzer";
import { SymbolTable } from "../src/chord/SymbolsTable";
import { CodeProvider } from "../src/chord/CodeProvider";
import { DisChordASTNode, DisChordNodeType, DisChordTokenType } from "../src/dischord/types";
import { FileSystem } from "../src/utils/FileSystem";
import { CompilationContext } from "../src/cli/commands/CompileCommand";
import Prettifier from "../src/utils/Prettifier";

/**
 * Base test class implementing the standard compilation pipeline execution.
 *
 * @class Test
 * @abstract
 */
export abstract class Test {
    /**
     * The name of the test case.
     *
     * @type {string}
     * @public
     * @abstract
     * @readonly
     */
    public abstract readonly name: string;

    /**
     * A brief description of what the test validates.
     *
     * @type {string}
     * @public
     * @abstract
     * @readonly
     */
    public abstract readonly description: string;

    /**
     * Absolute path to the directory containing test fixture files.
     * Injected automatically by the Tester engine upon discovery.
     *
     * @type {string}
     * @public
     */
    public fixturePath: string = '';

    /**
     * Flag indicating whether to override existing snapshot files with new outputs.
     */
    public forceUpdate: boolean = false;

    /**
     * When set, this test expects compilation to *fail* with an error whose message contains
     * this substring, instead of succeeding and matching output snapshots. No `expected.ast.json`
     * or `expected.mjs` fixture is needed for this kind of test — the assertion is "it throws",
     * not "it produces this exact output". Useful for validating that invalid input (duplicate
     * declarations, an unresolved base class, etc.) is correctly rejected.
     *
     * @type {string | undefined}
     * @public
     */
    public readonly expectedError?: string;

    /**
     * Reads the raw input .chord file for this test.
     *
     * @type {string}
     * @protected
     * @throws {Error} If the file cannot be read.
     */
    protected get code(): string {
        const file = path.join(this.fixturePath, 'input.chord');
        return fs.readFileSync(file, 'utf-8');
    }

    /**
     * Reads the expected AST snapshot file.
     *
     * @type {string}
     * @protected
     * @throws {Error} If the file cannot be read.
     */
    protected get expectedAST(): string {
        const file = path.join(this.fixturePath, 'expected.ast.json');
        return fs.readFileSync(file, 'utf-8');
    }

    /**
     * Reads the expected generated JS file.
     *
     * @type {string}
     * @protected
     * @throws {Error} If the file cannot be read.
     */
    protected get expectedCode(): string {
        const file = path.join(this.fixturePath, 'expected.mjs');
        return fs.readFileSync(file, 'utf-8');
    }

    /**
     * Standard execution pipeline for tests.
     * Executes lexing, parsing, analysis and generation, then either validates the result against
     * snapshots (the default) or, if `expectedError` is set, asserts that compilation throws
     * instead. Subclasses can override this method if custom test behavior is required.
     *
     * @method run
     * @returns {Promise<void>}
     * @protected
     */
    protected async run(): Promise<void> {
        if (this.expectedError !== undefined) {
            await this.assertThrows(this.expectedError);
            return;
        }

        const { ast, output } = await this.compile();

        const prettifiedOutput = await Prettifier.prettify(output);
        const actualAstJson = JSON.stringify(ast, null, 2);

        await this.assertOrUpdateSnapshot(actualAstJson, 'ast');
        await this.assertOrUpdateSnapshot(prettifiedOutput, 'code');
    }

    /**
     * Runs the full compilation pipeline (lexer → parser → analyzer → generator) for this test's
     * `input.chord`, without prettifying or comparing against any snapshot — the shared step both
     * the snapshot-comparison path and the error-expectation path in `run()` build on.
     *
     * @method compile
     * @returns {Promise<{ ast: DisChordASTNode[]; output: string }>}
     * @protected
     */
    protected async compile(): Promise<{ ast: DisChordASTNode[]; output: string }> {
        const context: CompilationContext<DisChordNodeType> = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: FileSystem.configure(this.fixturePath).projectRoot,
            extraFiles: new Map()
        };

        const fileName = path.basename(this.fixturePath);
        console.log(`Compilando: ${path.relative(context.projectRoot, fileName)}`);

        DisChordParser.registerGrammar(context);

        const code = this.code;
        context.codeProvider.currentCode = { name: fileName, content: code };

        const lexer = new Lexer<DisChordTokenType>(context);
        const tokens = lexer.tokenize();

        const parser = new DisChordParser(tokens, context);
        const ast: DisChordASTNode[] = parser.parse();

        new DisChordAnalyzer(context).analyze(ast);

        const generator = new DisChordGenerator(context, ast);
        const output = generator.generate();

        return { ast, output };
    }

    /**
     * Runs `compile()` and asserts it throws an error whose message contains `substring`. Used by
     * `run()` when `expectedError` is set.
     *
     * @method assertThrows
     * @param {string} substring - Text the thrown error's message must contain.
     * @returns {Promise<void>}
     * @protected
     * @throws {Error} If compilation succeeds, or throws an error not containing `substring`.
     */
    protected async assertThrows(substring: string): Promise<void> {
        let thrownMessage: string | undefined;

        try {
            await this.compile();
        } catch (error) {
            thrownMessage = error instanceof Error ? error.message : String(error);
        }

        if (thrownMessage === undefined) {
            throw new Error(`Se esperaba que la compilación lanzara un error, pero tuvo éxito.`);
        }

        if (!thrownMessage.includes(substring)) {
            throw new Error(`El error lanzado no contiene el texto esperado ('${substring}').\nRecibido: ${thrownMessage}`);
        }
    }

    /**
     * Validates generated output against a snapshot, or automatically updates the file if required.
     *
     * @method assertOrUpdateSnapshot
     * @param {string} actualContent - Content generated by the compilation pipeline.
     * @param {'ast' | 'code'} snapshotType - Target snapshot fixture type to compare or update.
     * @returns {Promise<void>}
     * @protected
     * @throws {Error} If comparison fails and not in snapshot update mode.
     */
    protected async assertOrUpdateSnapshot(actualContent: string, snapshotType: 'ast' | 'code'): Promise<void> {
        const targetFilename = snapshotType === 'ast' ? 'expected.ast.json' : 'expected.mjs';
        const targetPath = path.join(this.fixturePath, targetFilename);

        if (this.forceUpdate || !fs.existsSync(targetPath)) {
            switch (snapshotType) {
                case 'code':
                    await Prettifier.savePrettified(targetPath, actualContent.trim() + '\n');
                    break;
                case 'ast':
                    const formattedActual = JSON.stringify(JSON.parse(actualContent), null, 2);
                    fs.writeFileSync(targetPath, formattedActual, 'utf-8');
                    break;
            }

            console.log(`[SNAPSHOT UPDATED] ${targetPath}`);
            return;
        }

        const expectedContent = snapshotType === 'ast' ? this.expectedAST : this.expectedCode;
        this.assertDeepEqual(actualContent, expectedContent, snapshotType);
    }

    /**
     * Asserts strict string match between actual result and expected snapshot.
     *
     * @method assertDeepEqual
     * @param {string} actual - The stringified value produced by the pipeline.
     * @param {string} expected - The expected outcome string.
     * @returns {void}
     * @protected
     * @throws {Error} Throws an assertion failure error if the processed strings do not match.
     */
    protected assertDeepEqual(actual: string, expected: string, type: 'ast' | 'code'): void {
        let actualStr, expectedStr;

        switch (type) {
            case 'ast':
                actualStr = JSON.stringify(JSON.parse(actual), null, 2);
                expectedStr = JSON.stringify(JSON.parse(expected), null, 2);
                break;
            case 'code':
                actualStr = actual.replace(/\r\n/g, '\n').trim();
                expectedStr = expected.replace(/\r\n/g, '\n').trim();
                break;
        }

        if (actualStr !== expectedStr) {
            throw new Error(
                `Assertion Failed\n` +
                `--- EXPECTED ---\n${expectedStr}\n` +
                `--- ACTUAL ---\n${actualStr}`
            );
        }
    }

    /**
     * Runner method to execute the test lifecycle wrapper.
     *
     * @method execute
     * @returns {Promise<boolean>} True if passed, false if failed.
     * @public
     */
    public async execute(): Promise<boolean> {
        try {
            await this.run();
            console.log(`[PASSED] ${this.name}: ${this.description}`);
            return true;
        } catch (error) {
            console.error(`[FAILED] ${this.name}: ${this.description}`);
            console.error(error instanceof Error ? error.stack : String(error));
            return false;
        }
    }
}