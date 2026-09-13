import { Test } from "../../../Test";

/**
 * @class VariableUnionTypeTest
 * @description Validates that `var <id> tipo (<a>|<b>)[] es [ ... ]` and the parenthesis-free
 * scalar form `var <id> tipo <a>|<b> es <expr>` both compile the same as the untyped form (the
 * annotation is compile-time only and erased at generation), and that an initializer using only
 * some of the declared union's members is accepted (`ResolveVariableTypesRule.isCompatible`
 * checks subset membership, not exact equality).
 */
export class VariableUnionTypeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Variable Union Type - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to compile a primitive union type annotation (scalar and array) the same as the untyped form, accepting an initializer using only some of the union's members";
}
