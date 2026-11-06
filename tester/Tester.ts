import { pathToFileURL } from "node:url";

import { Test } from "./Test";
import { Directory } from "../src/utils/Directory";
import { File } from "../src/utils/File";
import { ExitCode } from "../src/cli/ExitCode";

/**
 * Interface representing a discovered test entry with its file system location.
 *
 * @interface DiscoveredTest
 */
interface DiscoveredTest {
    /**
     * Constructor for the discovered Test class.
     *
     * @type {new () => Test}
     */
    TestClass: new () => Test;

    /**
     * Absolute path to the directory where the test class file is located.
     *
     * @type {string}
     */
    directory: string;
}

/**
 * Built-in dynamic testing engine responsible for scanning, instantiating, and executing DisChord test suites.
 *
 * @class Tester
 */
export class Tester {
    /**
     * Absolute path to the directory containing test definitions.
     *
     * @type {string}
     * @private
     * @readonly
     */
    private readonly testsDirectory: string = Directory.of(process.cwd()).resolve('tester', 'tests');

    /**
     * Global flag determined by the `UPDATE_SNAPSHOTS` environment variable to enforce snapshot file updates.
     *
     * @type {boolean}
     * @private
     * @readonly
     */
    private readonly forceUpdate: boolean = process.env.UPDATE_SNAPSHOTS === "true";

    /**
     * Discovers all test classes, instantiates them, and executes them sequentially.
     *
     * @method testAll
     * @returns {Promise<void>} Resolves when all test execution and assertions complete.
     * @public
     */
    public async testAll(): Promise<void> {
        console.log(`\nStarting DisChord Test Pipeline...\n`);

        const testClasses = await this.discoverTestClasses();

        if (testClasses.length === 0) {
            console.warn(`[WARN] No tests found under directory: ${this.testsDirectory}`);
            return;
        }

        let passedCount = 0;
        let failedCount = 0;

        for (const { TestClass, directory } of testClasses) {
            const instance = new TestClass();

            instance.forceUpdate = this.forceUpdate;
            instance.fixturePath = directory;

            const success = await instance.execute();

            if (success) passedCount++;
            else failedCount++;
        }

        this.printSummary(passedCount, failedCount);
    }

    /**
     * Recursively walks the given directory looking for source files and dynamically imports valid `Test` classes.
     *
     * @method discoverTestClasses
     * @param {string} [dir] - Target directory path to scan. Defaults to `this.testsDirectory` if omitted.
     * @returns {Promise<Array<DiscoveredTest>>} Array of discovered test class constructors extending `Test`.
     * @private
     */
    private async discoverTestClasses(dir?: string): Promise<Array<DiscoveredTest>> {
        const testClasses: Array<DiscoveredTest> = [];

        const directory = Directory.tryOf(dir ?? this.testsDirectory);
        if (!directory) return testClasses;

        for (const entry of directory.entries()) {
            if (entry instanceof Directory) {
                testClasses.push(...await this.discoverTestClasses(entry.absolutePath));
            } else if (Tester.isTestFile(entry)) {
                testClasses.push(...await this.testClassesOf(entry));
            }
        }

        return testClasses;
    }

    /**
     * Whether a file may hold test classes: a script that is neither a snapshot nor a declaration file.
     *
     * @method isTestFile
     * @param {File} file - File found while scanning.
     * @returns {boolean}
     * @private
     */
    private static isTestFile(file: File): boolean {
        const isScript = file.hasExtension(".ts") || file.hasExtension(".js");

        return isScript && !file.name.startsWith("expected.") && !file.name.endsWith(".d.ts");
    }

    /**
     * Imports a source file and collects the `Test` subclasses it exports.
     *
     * @method testClassesOf
     * @param {File} file - The test source file.
     * @returns {Promise<Array<DiscoveredTest>>} One entry per exported test class.
     * @private
     */
    private async testClassesOf(file: File): Promise<Array<DiscoveredTest>> {
        const importedModule = await import(pathToFileURL(file.absolutePath).href);

        return Object.values<unknown>(importedModule)
            .filter((exported): exported is new () => Test =>
                typeof exported === "function" && exported.prototype instanceof Test && exported !== Test)
            .map(TestClass => ({ TestClass, directory: file.directory }));
    }

    /**
     * Outputs the final metric reports and terminates the process with an appropriate exit code.
     *
     * @method printSummary
     * @param {number} passed - Amount of successful test cases.
     * @param {number} failed - Amount of crashed or mismatched test cases.
     * @returns {void}
     * @private
     */
    private printSummary(passed: number, failed: number): void {
        const total = passed + failed;

        console.log(`\n\nDISCHORD TEST SUMMARY\n`);
        console.log(`Total Suites : ${total}`);
        console.log(`Passed       : ${passed}`);
        console.log(`Failed       : ${failed}`);

        process.exit(failed > 0 ? ExitCode.CodeErrors : ExitCode.Success);
    }
}