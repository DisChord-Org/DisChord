import path from "node:path";
import fs from "node:fs";

import { Test } from "./Test";

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
    private readonly testsDirectory: string = path.join(process.cwd(), 'tester', 'tests');

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

        if (!dir) dir = this.testsDirectory;
        if (!fs.existsSync(dir)) return testClasses;

        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                const nestedClasses = await this.discoverTestClasses(fullPath);
                testClasses.push(...nestedClasses);
                continue;
            }

            const isTestFile = entry.isFile() && (entry.name.endsWith(".ts") || entry.name.endsWith(".js"));
            const isDeclarationFile = entry.name.endsWith(".d.ts");

            if (isTestFile && !isDeclarationFile) {
                const importedModule = await import(fullPath);

                for (const exportKey of Object.keys(importedModule)) {
                    const exportedItem = importedModule[exportKey];

                    if (typeof exportedItem === "function" && exportedItem.prototype instanceof Test && exportedItem !== Test) {
                        testClasses.push({
                            TestClass: exportedItem as new () => Test,
                            directory: path.dirname(fullPath)
                        });
                    }
                }
            }
        }

        return testClasses;
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

        if (failed > 0) process.exit(1);
        else process.exit(0);
    }
}