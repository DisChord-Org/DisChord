import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Test } from "../../../Test";

/**
 * @class CheckFileInSubfolderTest
 * @description Validates that a file in a subfolder of `src/` (where commands and events live) belongs to the project of the nearest `package.json` above it: `--check` and `--stdin` have to check it, not fail as a tool for not finding the project.
 */
export class CheckFileInSubfolderTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Check File In Subfolder - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to find the project of a file that sits in a subfolder of src, on disk and through --stdin';

    private static readonly Source = 'nuevo comando Ping {\n    descripcion "responde"\n}\n';

    /**
     * Not a comparison with a snapshot: it runs the CLI as a process and reads its JSON.
     * @override
     */
    protected override async run (): Promise<void> {
        const root = path.resolve(__dirname, '../../../..');
        const project = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-subfolder-'));
        const folder = path.join(project, 'src', 'comandos', 'utilidad');
        const onDisk = path.join(folder, 'ping.chord');

        fs.mkdirSync(folder, { recursive: true });
        fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'subfolder', type: 'module' }));
        fs.writeFileSync(onDisk, CheckFileInSubfolderTest.Source);

        const cli = (args: string[], input?: string) => spawnSync(
            process.execPath,
            [ '--import', 'tsx', path.join(root, 'src/index.ts'), ...args, '--json' ],
            { cwd: root, encoding: 'utf-8', input }
        );

        try {
            this.expectClean('--check', cli([ onDisk, '--check' ]));
            // a buffer that was never saved
            this.expectClean('--stdin', cli([ '--stdin', '--stdin-filepath', path.join(folder, 'nuevo.chord') ], CheckFileInSubfolderTest.Source));

            if (fs.existsSync(path.join(project, 'dist')) || fs.existsSync(path.join(folder, 'dist'))) throw new Error('A check must not write any output');
        } finally {
            fs.rmSync(project, { recursive: true, force: true });
        }
    }

    private expectClean (label: string, result: ReturnType<typeof spawnSync>): void {
        const output = String(result.stdout);

        if (result.status !== 0) throw new Error(`${label}: the exit code should be 0, got ${result.status}: ${output}`);
        if (JSON.parse(output).ok !== true) throw new Error(`${label}: expected no diagnostics, got: ${output}`);
    }
}
