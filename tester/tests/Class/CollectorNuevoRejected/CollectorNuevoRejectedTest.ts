import { Test } from "../../../Test";

/**
 * @class CollectorNuevoRejectedTest
 * @description Validates that `nuevo recolector <var> {}` compiles the same as the plain
 * `recolector <var> {}` form. Unlike every other `nuevo X Y {}` form (embed, boton, comando,
 * class-inheritance shorthand), `recolector` never declares a new name — it attaches behavior to
 * an existing variable — so the leading `nuevo` is simply a no-op here rather than an error:
 * `DisChordStatementParser` only wraps a result in a reusable `VariableNode` for the
 * `UnreservedComponentDeclarations` node types, and falls through unchanged otherwise.
 */
export class CollectorNuevoRejectedTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Collector Nuevo Rejected - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile 'nuevo recolector' the same as the plain 'recolector' form, since 'recolector' never declares a new name";
}
