import { Test } from "../../../Test";

/**
 * @class VariableReservedMemberCollectionsTest
 * @description Validates that `Mapa` and `Conjunto` members renamed after `Texto`/`Lista` ones (`tiene`, `limpiar`, `agregar`) are emitted as `has`, `clear` and `add` when the receiver is typed.
 */
export class VariableReservedMemberCollectionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Reserved Member Collections - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to emit Map and Set members through the receiver class";
}
