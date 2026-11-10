import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { Test } from "../../../Test";

/**
 * @class CommandChannelAwaitedTest
 * @description Checks the `canal` a command finds in scope: the branch of a prefix command fetches
 * the channel, so it has to wait for it (`await`), while the slash branch reads it as it is, and the
 * generated file has to be valid JavaScript.
 */
export class CommandChannelAwaitedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Command Channel Awaited - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to await the channel that a prefix command fetches';

    /**
     * Not a comparison with a snapshot: it reads the generated code and parses it.
     * @override
     */
    protected override async run (): Promise<void> {
        const { output } = await this.compile();
        const declaration = output.split('\n').find(line => line.includes('const canal ='));

        if (!declaration) throw new Error('The command does not declare `canal`');
        if (!/:\s*await cliente\.channels\.fetch\(contexto\.channelId\)/.test(output.replace(/\s+/g, ' ').slice(output.replace(/\s+/g, ' ').indexOf('const canal =')))) {
            throw new Error('The prefix branch of `canal` is not awaited');
        }
        if (/\?\s*await /.test(output.replace(/\s+/g, ' ').slice(output.replace(/\s+/g, ' ').indexOf('const canal =')).split(';')[0])) {
            throw new Error('The slash branch of `canal` must be read as it is');
        }

        this.assertValidJavaScript(output);
    }

    private assertValidJavaScript (code: string): void {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-canal-'));

        try {
            const file = path.join(directory, 'command.mjs');
            fs.writeFileSync(file, code);

            const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
            if (result.status !== 0) throw new Error(`The generated file is not valid JavaScript:\n${result.stderr}`);
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }
}
