import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Test } from "../../../Test";

/**
 * @class AnalysisErrorIsDiagnosticTest
 * @description Validates that an error of an analysis rule reaches the editor as a diagnostic of the code (`phase`, `line`, `column`, exit code 1) and not as a failure of the tool: a rule has to throw its error as an object, not as the text `format()` makes of it.
 */
export class AnalysisErrorIsDiagnosticTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Analysis Error Is Diagnostic - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to report an analysis error as a located diagnostic with exit code 1';

    /**
     * Not a comparison with a snapshot: it runs the CLI as a process and reads its JSON.
     * @override
     */
    protected override async run (): Promise<void> {
        const root = path.resolve(__dirname, '../../../..');
        const source = 'var p tipo [numero, texto] es [1, "a"]\nvar a tipo texto es p[5]\n';

        // a project of its own: a package.json and a src folder
        const project = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-diagnostic-'));
        fs.mkdirSync(path.join(project, 'src'));
        fs.writeFileSync(path.join(project, 'package.json'), JSON.stringify({ name: 'diagnostic', type: 'module' }));

        let result: ReturnType<typeof spawnSync>;

        try {
            result = spawnSync(
                process.execPath,
                [ '--import', 'tsx', path.join(root, 'src/index.ts'), '--stdin', '--stdin-filepath', path.join(project, 'src', 'buffer.chord'), '--json' ],
                { cwd: root, encoding: 'utf-8', input: source }
            );
        } finally {
            fs.rmSync(project, { recursive: true, force: true });
        }

        const output = String(result.stdout);
        const document = JSON.parse(output);
        const diagnostic = document.diagnostics?.[0];

        if (result.status !== 1) throw new Error(`The exit code should be 1 (a problem of the code), got ${result.status}`);
        if (document.ok !== false || !diagnostic) throw new Error(`Expected one diagnostic, got: ${output}`);
        if (diagnostic.phase !== 'Análisis') throw new Error(`The phase should be 'Análisis', got '${diagnostic.phase}'`);
        if (diagnostic.line !== 2 || typeof diagnostic.column !== 'number') throw new Error(`The diagnostic has no location: ${JSON.stringify(diagnostic)}`);
    }
}
