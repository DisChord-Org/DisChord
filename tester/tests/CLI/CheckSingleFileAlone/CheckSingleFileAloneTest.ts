import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Test } from "../../../Test";

/**
 * @class CheckSingleFileAloneTest
 * @description Validates that `--check` of one file is about that file alone, even when it sits directly in `src/` (where compiling it stands for the whole project): the error of a sibling must not be reported for it. Checking the folder still covers every file.
 */
export class CheckSingleFileAloneTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Check Single File Alone - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to check only the file it was asked about, and the whole project when asked about its folder';

    /**
     * Not a comparison with a snapshot: it runs the CLI as a process and reads its JSON.
     * @override
     */
    protected override async run (): Promise<void> {
        const root = path.resolve(__dirname, '../../../..');
        const project = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-alone-'));
        const src = path.join(project, 'src');
        const valid = path.join(src, 'index.chord');
        const broken = path.join(src, 'roto.chord');

        fs.mkdirSync(src);
        fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'alone', type: 'module' }));
        fs.writeFileSync(valid, 'var a es 1\nimprimir(a)\n');
        fs.writeFileSync(broken, 'imprimir(noDeclarada)\n');

        const check = (target: string) => {
            const result = spawnSync(
                process.execPath,
                [ '--import', 'tsx', path.join(root, 'src/index.ts'), target, '--check', '--json' ],
                { cwd: root, encoding: 'utf-8' }
            );

            return { status: result.status, output: String(result.stdout), document: JSON.parse(String(result.stdout)) };
        };

        try {
            const alone = check(valid);

            if (alone.status !== 0 || alone.document.ok !== true) throw new Error(`The valid file should check clean on its own, got (${alone.status}): ${alone.output}`);

            const whole = check(src);
            const file = whole.document.diagnostics?.[0]?.file;

            if (whole.status !== 1 || path.resolve(String(file)) !== path.resolve(broken)) throw new Error(`Checking the folder should report the broken file, got (${whole.status}): ${whole.output}`);
        } finally {
            fs.rmSync(project, { recursive: true, force: true });
        }
    }
}
