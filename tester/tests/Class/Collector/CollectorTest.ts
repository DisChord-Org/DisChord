import { Test } from "../../../Test";

/**
 * @class CollectorTest
 * @description Validates that a component collector (`nuevo recolector <mensaje> { alPulsarId { <id> { <código> } } }`)
 * generates the `createComponentCollector(...)` call plus a `.run(id, handler)` for each button
 * ID — mirrors `examples/botCollectorExample.chord`. Also guards against a real bug found in this
 * area: `BDOParser` used to swallow a bare call statement like `imprimir(...)` (no trailing ';')
 * as if it were a property, silently dropping the collector's handler body entirely.
 */
export class CollectorTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to generate a component collector with a working alPulsarId handler";
}
