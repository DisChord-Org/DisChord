import { Test } from "./Test";
import { SimpleBDOParserTest } from "./tests/parser/bdo/SimpleBDOParserTest";

/**
 * @class Tester
 * @description Built-in testing engine responsible for instantiating and executing DisChord test suites.
 */
export class Tester {
    /**
     * @type {Array<new () => Test>} List of test class constructors to be executed.
     * @private
     */
    private tests: Array<new () => Test> = [
        SimpleBDOParserTest
    ];

    /**
     * @method testAll
     * @description Instantiates and executes every registered test case sequentially, tracking results.
     * @returns {Promise<void>}
     * @public
     */
    public async testAll(): Promise<void> {
        console.log(`\nStarting DisChord Test Pipeline\n`);

        let passedCount = 0;
        let failedCount = 0;

        for (const TestClass of this.tests) {
            const instance = new TestClass();
            const success = await instance.execute();
            
            if (success) passedCount++;
            else failedCount++;
        }

        this.printSummary(passedCount, failedCount);
    }

    /**
     * @method printSummary
     * @description Outputs the final metric reports and terminates the process accordingly.
     * @param {number} passed - Amount of successful test cases.
     * @param {number} failed - Amount of crashed test cases.
     * @returns {void}
     * @private
     */
    private printSummary(passed: number, failed: number): void {
        const total = passed + failed;

        console.log(`\n\nDISCHORD TEST SUMMARY\n`);
        console.log(`Total Suites : ${total}`);
        console.log(`Passed       : ${passed}`);
        console.log(`Failed       : ${failed}`);

        process.exit(1);
    }
}