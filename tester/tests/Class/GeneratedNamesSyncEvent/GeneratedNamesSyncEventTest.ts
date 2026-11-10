import { Test } from "../../../Test";
import Prettifier from "../../../../src/utils/Prettifier";
import { GeneratedNames } from "../../../../src/dischord/Generator/constants/GeneratedNames";
import { GeneratedNamesSync } from "../GeneratedNamesSyncCommand/GeneratedNamesSync";

/**
 * @class GeneratedNamesSyncEventTest
 * @description Pins that an event file declares at the top level only what GeneratedNames lists
 */
export class GeneratedNamesSyncEventTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Generated Names Sync Event - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to declare in an event file only the names GeneratedNames lists";

    /**
     * @override
     */
    protected override async run (): Promise<void> {
        const { output } = await this.compile();

        GeneratedNamesSync.assertOnly(await Prettifier.prettify(output), GeneratedNames.SeyfertImports.event);
    }
}
