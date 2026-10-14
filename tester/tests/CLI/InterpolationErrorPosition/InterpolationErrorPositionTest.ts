import fs from "node:fs";
import path from "node:path";

import { Test } from "../../../Test";
import { Program } from "../../../../src/cli/Program";

/**
 * @class InterpolationErrorPositionTest
 * @description Validates that an incomplete expression inside the braces of an interpolated text is reported where the closing brace is, on the line of the text that holds it, and not at the end of the literal.
 */
export class InterpolationErrorPositionTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Interpolation Error Position - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to report an incomplete interpolated expression at its closing brace';

    /**
     * Not a comparison with a snapshot: it runs the CLI over the fixture and inspects the diagnostic.
     * @override
     */
    protected override async run (): Promise<void> {
        const input = path.join(this.fixturePath, 'input.chord');
        const lines = fs.readFileSync(input, 'utf-8').split('\n');

        const line = lines.findIndex(text => text.includes('}')) + 1;
        const column = lines[line - 1].indexOf('}') + 1;

        const printed: string[] = [];
        const original = console.log;
        const previousExitCode = process.exitCode;

        console.log = (...args: unknown[]) => { printed.push(args.join(' ')); };

        try {
            await new Program().parse(['node', 'dischord', input, '--emit', 'ast']);
        } finally {
            console.log = original;
            process.exitCode = previousExitCode;
        }

        const document = JSON.parse(printed[0]);
        const diagnostic = document.diagnostics?.[0];

        if (document.ok || !diagnostic) throw new Error(`A parse error was expected, got ${printed[0]}`);
        if (diagnostic.line !== line || diagnostic.column !== column) {
            throw new Error(`The error is at ${diagnostic.line}:${diagnostic.column}, expected ${line}:${column} (the closing brace)`);
        }
    }
}
