import { Test } from "../../../Test";
import Prettifier from "../../../../src/utils/Prettifier";
import { GeneratedNames } from "../../../../src/dischord/Generator/constants/GeneratedNames";
import { GeneratedNamesSync } from "../GeneratedNamesSyncCommand/GeneratedNamesSync";

/**
 * @class GeneratedNamesSyncBotTest
 * @description Pins that the file with `encender bot` declares at the top level only what GeneratedNames lists
 */
export class GeneratedNamesSyncBotTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Names Sync Bot - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to declare in a bot file only the names GeneratedNames lists";

    /**
     * @override
     */
    protected override async run (): Promise<void> {
        const { output } = await this.compile();

        GeneratedNamesSync.assertOnly(await Prettifier.prettify(output), [ ...GeneratedNames.SeyfertImports.client, GeneratedNames.ClientConstantName ]);
    }
}
