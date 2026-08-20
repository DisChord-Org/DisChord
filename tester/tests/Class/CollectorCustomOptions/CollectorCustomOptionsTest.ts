import { Test } from "../../../Test";

/**
 * @class CollectorCustomOptionsTest
 * @description Validates that a collector's optional properties (`filtro`, `tiempo`, `alFinalizar`)
 * each accept a referenced `funcion` and wire it into `createComponentCollector`'s real Seyfert
 * option shape: `filter`/`idle`/`onStop` (not the invented `timeout` key the old implementation
 * emitted). Every referenced callback receives `(..., cliente, contexto)` trailing its own
 * arguments so it keeps access to what an inline body used to get from closure alone.
 */
export class CollectorCustomOptionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Custom Options - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to wire custom 'filtro'/'tiempo'/'alFinalizar' callback references into filter/idle/onStop";
}
