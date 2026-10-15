import { Test } from "../../../Test";
import { File } from "../../../../src/utils/File";

/**
 * @class StartBotImportedTokenTest
 * @description Pins the imports that `seyfert.config.mjs` re-emits for the names the `encender bot`
 * block references: a library (`lib:X`) and a relative module are both specified from the project
 * root, since that is where the config file is written. The config is not part of the compiled file,
 * so it is compared with its own `expected.seyfert.config.mjs`, created on the first run.
 */
export class StartBotImportedTokenTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Start Bot Imported Token - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to re-emit the imports a bot block uses into seyfert.config.mjs, specified from the project root";

    /**
     * Not a comparison of the compiled file: it compares the generated Seyfert config.
     * @override
     */
    protected override async run (): Promise<void> {
        await this.compile();

        const extraFiles = this.compiledExtraFiles;
        const configPath = [ ...extraFiles.keys() ].find(file => file.endsWith('seyfert.config.mjs'));

        if (!configPath) throw new Error('seyfert.config.mjs was not generated');

        const actual = this.normalize(extraFiles.get(configPath)!);
        const expectedPath = this.fixture.resolve('expected.seyfert.config.mjs');

        if (!this.fixture.hasFile('expected.seyfert.config.mjs')) {
            File.write(expectedPath, actual + '\n');
            console.log(`[SNAPSHOT UPDATED] ${expectedPath}`);
            return;
        }

        const expected = this.normalize(this.fixture.file('expected.seyfert.config.mjs').read());

        if (actual !== expected) throw new Error(`seyfert.config.mjs differs.\n--- EXPECTED ---\n${expected}\n--- ACTUAL ---\n${actual}`);
    }

    private normalize (content: string): string {
        return content.replace(/\r\n/g, '\n').split('\n').map(line => line.trim()).filter(line => line !== '').join('\n');
    }
}
