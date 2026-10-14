import path from "node:path";
import { spawnSync } from "node:child_process";
import { Test } from "../../../Test";

/**
 * @class MissingPathMessageTest
 * @description Validates that a path that does not exist is a usage error: one clear line and the exit code of a tool failure, with the stack trace only under `--debug`, and the diagnostics document of `--json` untouched.
 */
export class MissingPathMessageTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Missing Path Message - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to print one line, without the stack trace, for a path that does not exist';

    /**
     * Not a comparison with a snapshot: it runs the CLI as a process and inspects what it prints.
     * @override
     */
    protected override async run (): Promise<void> {
        const missing = path.join(this.fixturePath, 'no-existe.chord');

        const plain = this.cli([ missing ]);
        const lines = plain.stderr.split('\n').filter(line => line.trim() !== '');

        if (plain.status !== 2) throw new Error(`The exit code should be 2, got ${plain.status}`);
        if (lines.length !== 1) throw new Error(`Expected one line, got ${lines.length}: ${plain.stderr}`);
        if (!lines[0].includes('No existe la ruta:') || !lines[0].includes('no-existe.chord')) throw new Error(`The line does not say which path is missing: ${lines[0]}`);

        const debug = this.cli([ missing, '--debug', 'all' ]);
        if (debug.status !== 2) throw new Error(`The exit code with --debug should be 2, got ${debug.status}`);
        if (!/\n\s+at /.test(debug.stderr)) throw new Error('--debug should keep the stack trace');

        const json = this.cli([ missing, '--json' ]);
        const document = JSON.parse(json.stdout);
        if (json.status !== 2 || document.ok !== false || document.diagnostics.length !== 1) throw new Error(`The --json document changed: ${json.stdout}`);
        if (json.stderr.trim() !== '') throw new Error(`--json should print nothing to stderr, got: ${json.stderr}`);
    }

    private cli (args: string[]): { status: number | null; stdout: string; stderr: string } {
        const root = path.resolve(__dirname, '../../../..');
        const result = spawnSync(process.execPath, [ '--import', 'tsx', path.join(root, 'src/index.ts'), ...args ], { cwd: root, encoding: 'utf-8' });

        return { status: result.status, stdout: result.stdout, stderr: result.stderr };
    }
}
