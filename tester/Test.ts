/**
 * @class Test
 * @description Single-class test structure utilizing overrides for DisChord's built-in testing engine.
 */
export abstract class Test {
    /**
     * @type {string} The name of the test case.
     */
    public abstract readonly name: string;

    /**
     * @type {string} A brief description of what the test validates.
     */
    public abstract readonly description: string;

    /**
     * @method run
     * @description Contains the assertion logic. Must be overridden by subclasses.
     * @returns {void | Promise<void>}
     * @abstract
     */
    public abstract run(): void | Promise<void>;

    /**
     * @method assertDeepEqual
     * @description Asserts strict structural equality between two values.
     * @param {string} actual The value produced by the compiler.
     * @param {string} expected The expected value or AST structure.
     * @protected
     */
    protected assertDeepEqual(actual: string, expected: string): void {
        const actualStr = JSON.stringify(actual, null, 2);
        const expectedStr = JSON.stringify(expected, null, 2);

        if (actualStr !== expectedStr) {
            throw new Error(
                `Assertion Failed\n` +
                `--- EXPECTED ---\n${expectedStr}\n` +
                `--- ACTUAL ---\n${actualStr}`
            );
        }
    }

    /**
     * @method execute
     * @description Runner method to execute the test wrapper and handle lifecycle logs.
     * @returns {Promise<boolean>} True if passed, false if failed.
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