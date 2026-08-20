import { Test } from "../../../Test";

/**
 * @class CollectorNuevoRejectedTest
 * @description Validates that `nuevo recolector <var> {}` is rejected with a clear error.
 * Unlike every other `nuevo X Y {}` form (embed, boton, comando, class-inheritance shorthand),
 * `recolector` never declares a new name — it attaches behavior to an existing variable — so
 * writing it with `nuevo` reads exactly like the unrelated class shorthand despite meaning
 * something else. Only the plain `recolector <var> {}` form is accepted.
 */
export class CollectorNuevoRejectedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Nuevo Rejected - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to reject 'nuevo recolector' since 'recolector' never declares a new name";

    /**
     * @type {string}
     */
    public readonly expectedError: string = "no se declara con 'nuevo'";
}
