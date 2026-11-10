import { Test } from "../../../Test";
import Prettifier from "../../../../src/utils/Prettifier";
import { GeneratedNames } from "../../../../src/dischord/Generator/constants/GeneratedNames";
import { GeneratedNamesSync } from "../GeneratedNamesSyncCommand/GeneratedNamesSync";

/**
 * @class GeneratedNamesSyncCommandTest
 * @description Pins that a command file that uses every kind of helper declares at the top level only what GeneratedNames lists (a Seyfert import or constant added by hand to a visitor makes it fail)
 */
export class GeneratedNamesSyncCommandTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Names Sync Command - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to declare in a command file only the names GeneratedNames lists";

    /**
     * @override
     */
    protected override async run (): Promise<void> {
        const { output } = await this.compile();

        GeneratedNamesSync.assertOnly(await Prettifier.prettify(output), GeneratedNamesSync.commandNames('Fregadero'));
    }
}
