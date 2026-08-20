import { Test } from "../../../Test";

/**
 * @class CollectorTest
 * @description Validates that a component collector (`recolector <mensaje> { alPulsarId { <id>
 * <funcionReferenciada> } } }`) generates the `createComponentCollector(...)` call plus a
 * `.run(id, handler)` per button id, wiring each id to a standalone `funcion` referenced by name
 * — mirrors `examples/botCollectorExample.chord`. Also guards the `cliente`/`contexto` forwarding
 * those referenced callbacks need since, unlike an inline body, they don't close over the
 * command's `run(contexto)` scope.
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
