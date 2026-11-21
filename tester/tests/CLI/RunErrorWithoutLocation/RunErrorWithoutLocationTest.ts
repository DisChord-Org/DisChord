import path from "node:path";
import { Test } from "../../../Test";
import { RunCommand } from "../../../../src/cli/commands/RunCommand";
import { DisChordError } from "../../../../src/errors/DisChordError";

/**
 * @class RunErrorWithoutLocationTest
 * @description Validates that an error thrown while running a compiled file does not invent a position.
 */
export class RunErrorWithoutLocationTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Run Error Without Location - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to wrap an error of the executed file without a made-up 0:0 location';

    /**
     * Not a comparison with a snapshot: it runs a file that throws and reads the error it is wrapped in.
     * @override
     */
    protected override async run (): Promise<void> {
        const log = console.log;
        const cwd = process.cwd(); // RunCommand moves into the project
        let thrown: unknown;

        console.log = () => {};
        try {
            await new RunCommand().execute(path.join(this.fixturePath, 'falla.mjs'));
        } catch (error) {
            thrown = error;
        } finally {
            console.log = log;
            process.chdir(cwd);
        }

        if (!(thrown instanceof DisChordError)) throw new Error(`Expected a DisChordError, got: ${String(thrown)}`);
        if (!thrown.message.includes('fallo al ejecutar')) throw new Error(`Unexpected message: ${thrown.message}`);
        if (thrown.location !== undefined) throw new Error(`The error should have no location, got ${JSON.stringify(thrown.location)}`);
        if (/\[0:0\]/.test(thrown.format())) throw new Error('The header should not print [0:0]');
    }
}
