import path from "node:path";

import { Test } from "../../../Test";
import { Program } from "../../../../src/cli/Program";

interface EmittedToken { type: string; value: string; blankLineBefore?: true }

/**
 * @class EmitBlankLineBeforeTest
 * @description Validates that `--emit tokens` tells which token comes right after an empty line (`blankLineBefore: true`, present only then), which is what separates the properties of a block from its code.
 */
export class EmitBlankLineBeforeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Emit Blank Line Before - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to mark in the emitted tokens the one that follows an empty line";

    /**
     * Not a comparison with a snapshot: it runs the CLI over the fixture and inspects what it prints.
     * @override
     */
    protected override async run (): Promise<void> {
        const tokens = await this.emit(path.join(this.fixturePath, 'input.chord'));
        const marked = tokens.filter(token => token.blankLineBefore !== undefined).map(token => token.value);

        // only the first token after an empty line carries the mark: the code of the block, and nothing else
        if (marked.join('|') !== 'consola') throw new Error(`The tokens marked as after an empty line are ${JSON.stringify(marked)}`);
        if (tokens.some(token => token.blankLineBefore !== undefined && token.blankLineBefore !== true)) throw new Error('blankLineBefore should be true or absent');
    }

    private async emit (target: string): Promise<EmittedToken[]> {
        const printed: string[] = [];
        const original = console.log;
        const previousExitCode = process.exitCode;

        console.log = (...args: unknown[]) => { printed.push(args.join(' ')); };

        try {
            await new Program().parse(['node', 'dischord', target, '--emit', 'tokens']);
        } finally {
            console.log = original;
            process.exitCode = previousExitCode;
        }

        const document = JSON.parse(printed[0]);
        if (!document.ok) throw new Error(`--emit tokens failed: ${printed[0]}`);

        return document.tokens;
    }
}
