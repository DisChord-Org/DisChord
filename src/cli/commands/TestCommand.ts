import { Tester } from "../../../tester/Tester";

/**
 * Command handler responsible for triggering the internal test suite.
 * 
 * @class TestCommand
 */
export class TestCommand {
    /**
     * Executes all internal integration and unit tests for the compiler components.
     * 
     * @returns {Promise<void>}
     */
    public async execute(): Promise<void> {
        const tester = new Tester();
        await tester.testAll();
    }
}