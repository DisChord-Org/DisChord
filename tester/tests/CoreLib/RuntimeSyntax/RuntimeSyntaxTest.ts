import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { Test } from "../../../Test";
import { consoleRuntimeModule, runtimeHelpersModule } from "../../../../src/chord/corelib";
import {
    channelsModule, channelExtensionsModule, createMessageModule, messageExtensionsModule, moderationModule, userExtensionsModule
} from "../../../../src/dischord/corelib";
import { QuotaRuntime } from "../../../../src/dischord/corelib/QuotaRuntime";
import { ContextRuntime } from "../../../../src/dischord/corelib/ContextRuntime";

/**
 * @class RuntimeSyntaxTest
 * @description The runtime modules are JavaScript written as strings, which TypeScript never sees: this checks that
 * each one, and each shared fragment rendered with example values, is valid JavaScript (`node --check`, which parses
 * the file as an ES module without running it).
 */
export class RuntimeSyntaxTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Runtime Syntax - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to keep every shared runtime module and fragment valid JavaScript";

    /**
     * Not a comparison with a snapshot: it parses every module without running it.
     * @override
     */
    protected override async run (): Promise<void> {
        const wrap = (body: string): string => `const ctx = {}; const fail = () => {}; const WHAT = {};\n${body}\nexport {};\n`;

        const sources: Record<string, string> = {
            console: consoleRuntimeModule.content,
            runtimeHelpers: runtimeHelpersModule.content,
            channels: channelsModule.content,
            channelExtensions: channelExtensionsModule.content,
            createMessage: createMessageModule.content,
            messageExtensions: messageExtensionsModule.content,
            moderation: moderationModule.content,
            userExtensions: userExtensionsModule.content,
            quotaFragment: wrap(QuotaRuntime.render(10, limit => `fail('x', "${limit}");`)),
            idsFragment: wrap(ContextRuntime.renderIds()),
            contextGuildFragment: wrap(`${ContextRuntime.renderIds()}\n${ContextRuntime.renderContextGuild(message => `fail('x', "${message}");`)}`),
            reasonFragment: wrap(`${ContextRuntime.renderIds()}\n${ContextRuntime.renderReason()}`)
        };

        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-syntax-'));

        try {
            Object.entries(sources).forEach(([name, source]) => this.check(directory, name, source));
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }

    private check (directory: string, name: string, source: string): void {
        const file = path.join(directory, `${name}.mjs`);
        fs.writeFileSync(file, source);

        try {
            execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
        } catch (error) {
            const detail = String((error as { stderr?: Buffer }).stderr ?? error).split('\n').slice(0, 6).join('\n');

            throw new Error(`The runtime '${name}' is not valid JavaScript:\n${detail}`);
        }
    }
}
