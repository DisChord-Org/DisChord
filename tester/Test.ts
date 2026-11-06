
import { DisChordASTNode } from "../src/dischord/types";
import { FileSystem } from "../src/utils/FileSystem";
import { Directory } from "../src/utils/Directory";
import Prettifier from "../src/utils/Prettifier";
import { FileCompiler } from "../src/cli/commands/FileCompiler";
import { ErrorMessage } from "../src/errors/ErrorMessage";
import { Snapshot, SnapshotType } from "./Snapshot";

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
     * or `expected.js` fixture is needed for this kind of test — the assertion is "it throws",
     * not "it produces this exact output". Useful for validating that invalid input (duplicate
     * declarations, an unresolved base class, etc.) is correctly rejected.
     *
     * @type {string | undefined}
     * @public
     */
    public readonly expectedError?: string;

    /**
     * The files the last `compile()` asked to write besides the compiled one (`seyfert.config.mjs`,
     * the shared runtime modules), by absolute path.
     *
     * @type {Map<string, string>}
     * @protected
     */
    protected compiledExtraFiles: Map<string, string> = new Map();

    /**
     * The directory of this test's fixture.
     *
     * @type {Directory}
     * @protected
     * @throws {Error} If the directory does not exist.
     */
    protected get fixture(): Directory {
        return Directory.of(this.fixturePath);
    }

    /**
     * Reads the raw input .chord file for this test.
     *
     * @type {string}
     * @protected
     * @throws {Error} If the file cannot be read.
     */
    protected get code(): string {
        return this.fixture.file('input.chord').read();
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
        const actualAstJson = JSON.stringify(ast);

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
        const config = FileSystem.configure(this.fixturePath);

        console.log(`Compilando: ${this.fixture.name}`);

        const { ast, output, extraFiles } = new FileCompiler({ run: false, depth: 1 })
            .compileWithTree(this.fixture.file('input.chord'), config, config.distDir);
        this.compiledExtraFiles = extraFiles;

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
            thrownMessage = ErrorMessage.of(error);
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
     * @param {SnapshotType} snapshotType - Target snapshot fixture type to compare or update.
     * @returns {Promise<void>}
     * @protected
     * @throws {Error} If comparison fails and not in snapshot update mode.
     */
    protected async assertOrUpdateSnapshot(actualContent: string, snapshotType: SnapshotType): Promise<void> {
        await new Snapshot(this.fixture, this.forceUpdate).assertOrUpdate(actualContent, snapshotType);
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