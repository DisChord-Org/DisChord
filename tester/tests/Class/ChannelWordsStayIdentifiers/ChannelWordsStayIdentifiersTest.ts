import { Test } from "../../../Test";

/**
 * @class ChannelWordsStayIdentifiersTest
 * @description Validates that `crear`, `editar` and `borrar` are not reserved: they still work as a function name and as variable names, since a channel action is recognized only by the `<verbo> canal {` shape.
 */
export class ChannelWordsStayIdentifiersTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Words Stay Identifiers - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to keep crear, editar and borrar usable as ordinary names';
}
