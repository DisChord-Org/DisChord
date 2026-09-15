import { Test } from "../../../Test";

/**
 * @class VariableTupleTypeTest
 * @description Validates that `var <id> tipo [<a>, <b>] es [ ... ]` — a fixed-length,
 * position-specific tuple, a union at one position, and an array of tuples (`[<a>, <b>][]`) —
 * compiles the same as the untyped form (the annotation is compile-time only and erased at
 * generation). Exercises `ResolveVariableTypesRule.validateTupleLiteral`'s position-by-position
 * check against `DataType`'s `TupleDataType` variant.
 */
export class VariableTupleTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Tuple Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a fixed-length tuple type annotation (plain, with a union member, and as an array of tuples) the same as the untyped form";
}
