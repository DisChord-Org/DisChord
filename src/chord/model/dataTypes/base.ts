import type { UnionDataType } from "./composite";

/**
 * Discriminates the shape of a `DataType` node — named exactly like `TokenType`/`PrimitiveType`/
 * `FieldKind` (a `const` registry plus a type extracting its values), even though each subclass
 * also knows its own `kind` as a fixed instance field — useful wherever code needs to branch on
 * shape without an `instanceof` chain (e.g. serializing to `expected.ast.json`).
 * @type {const}
 */
export const DataTypeKind = {
    Primitive: 'primitive',
    Any: 'any',
    Void: 'void',
    Class: 'class',
    UserClass: 'userClass',
    Union: 'union',
    Array: 'array',
    Tuple: 'tuple'
} as const;

/** Unified type extracting values from the `DataTypeKind` constant registry. */
export type DataTypeKind = typeof DataTypeKind[keyof typeof DataTypeKind];

/**
 * The structural model for everything a `var` declaration's `dataType` can be. Used by both
 * `VariableNode.dataType` (what was written/parsed) and `Symbol.dataType` (what was ultimately
 * resolved) — see each field's own doc comment for how their meanings differ. Always built via a
 * subclass's own static `of(...)` factory, never hand-assembled, and compared/rendered via its own
 * instance methods, never by string comparison.
 */
export abstract class DataType {
    /** Which concrete subclass this is — see {@link DataTypeKind}. */
    abstract readonly kind: DataTypeKind;

    /**
     * Whether a value of type `source` can be used where `this` (the declared/expected type) is
     * expected — the same "is this assignable" question TypeScript's checker answers structurally,
     * recursively, over its own `Type` tree, rather than by comparing display strings.
     *
     * Handles the one rule that's the same regardless of `this`'s own shape — when `source` is a
     * union, *every* member must be assignable to `this` (assigning a broader type requires the
     * narrower target to accept everything the source could actually be) — and otherwise defers to
     * {@link acceptsNonUnionSource}, each subclass's own half of the rule.
     * @param {DataType} source - The type being checked against this one.
     * @returns {boolean} Whether `source` is assignable to `this`.
     */
    public isAssignableFrom (source: DataType): boolean {
        if (this.kind === DataTypeKind.Any || source.kind === DataTypeKind.Any) return true;
        if (source.kind === DataTypeKind.Union) return (source as UnionDataType).members.every(member => this.isAssignableFrom(member));
        return this.acceptsNonUnionSource(source);
    }

    /**
     * The kind-specific half of {@link isAssignableFrom}, reached only once `source` is already
     * known not to be a union.
     * @protected
     */
    protected abstract acceptsNonUnionSource (source: DataType): boolean;

    /**
     * Renders this type to the text a user sees (in a `tipo` annotation's error message, e.g.) —
     * so every message is built the same way instead of each caller re-deriving its own text.
     * @returns {string} This type's display form.
     */
    public abstract format (): string;
}
