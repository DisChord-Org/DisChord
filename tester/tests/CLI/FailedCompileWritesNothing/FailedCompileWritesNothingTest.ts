import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Test } from "../../../Test";

/**
 * @class FailedCompileWritesNothingTest
 * @description Validates that a project where one file fails to compile writes no output at all (not even the files that did compile before it), and that a project that compiles writes every file.
 */
export class FailedCompileWritesNothingTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Failed Compile Writes Nothing - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to leave dist untouched when a file of the project fails, and write every file when all compile';

    private static readonly Valid = 'var x es 1\n';

    /**
     * Not a comparison with a snapshot: it runs the CLI as a process over a temporary project.
     * @override
     */
    protected override async run (): Promise<void> {
        const root = path.resolve(__dirname, '../../../..');
        const project = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-failed-'));
        const source = path.join(project, 'src');

        fs.mkdirSync(source, { recursive: true });
        fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'failed', type: 'module' }));
        fs.writeFileSync(path.join(source, 'a.chord'), FailedCompileWritesNothingTest.Valid);
        fs.writeFileSync(path.join(source, 'b.chord'), 'var x es "sin cerrar\n');

        const compile = () => spawnSync(
            process.execPath,
            [ '--import', 'tsx', path.join(root, 'src/index.ts'), project, '--no-run' ],
            { cwd: root, encoding: 'utf-8' }
        );

        try {
            if (compile().status === 0) throw new Error('A project with a file that does not compile should fail');
            if (fs.existsSync(path.join(project, 'dist'))) throw new Error('A failed compile must not write anything to dist');

            fs.writeFileSync(path.join(source, 'b.chord'), FailedCompileWritesNothingTest.Valid.replace('x es', 'otra es'));

            const result = compile();
            if (result.status !== 0) throw new Error(`The project should compile, got: ${result.stdout}${result.stderr}`);

            for (const name of [ 'a.js', 'b.js' ]) {
                if (!fs.existsSync(path.join(project, 'dist', name))) throw new Error(`dist/${name} should have been written`);
            }
        } finally {
            fs.rmSync(project, { recursive: true, force: true });
        }
    }
}
