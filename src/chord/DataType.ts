import { PrimitiveTypeName } from "./types";

/**
 * @file DataType.ts
 * @description `DataType` — the structural model behind a `var` declaration's `dataType` — mirrors
 * how TypeScript's own checker represents types internally: a real tagged-union *tree* (a
 * primitive, a union of members, an array of an element type, ...), never a pre-serialized string.
 * The string you see in an error message (`'numero|texto[]'`) is a *display* produced by
 * {@link formatDataType} at the end, the same way TS's checker only turns a `Type` into text when
 * it needs to show one to a user — comparison and compatibility (`isAssignable`) always work on
 * the tree itself, structurally, never on that string.
 *
 * The previous version of this file encoded everything as a single sorted-and-joined string
 * (`'numero|texto[]'`) and re-parsed it whenever a caller needed to inspect it — which worked for
 * "one level of union, one level of array" but had no way to grow: a tuple, for instance, needs
 * *order-preserving*, *position-specific* types, which doesn't fit a sorted/deduplicated string at
 * all, and would have needed its own incompatible encoding bolted on next to this one. A tree has
 * no such ceiling — a new shape is a new variant of the same `DataType` union, nothing else
 * changes.
 *
 * Split out of `types.ts` for the same reason as before: that file is purely declarative
 * (interfaces, type aliases, `const` registries like `TokenType`/`PrimitiveType`), with no actual
 * behavior; everything here is real logic. `PrimitiveType`/`PrimitiveTypeName` themselves stay in
 * `types.ts` — they're a plain data registry, no different from `TokenType`.
 */

/**
 * Discriminates the shape of a `DataType` node — named exactly like `TokenType`/`PrimitiveType`/
 * `FieldKind` (a `const` registry plus a type extracting its values) instead of writing
 * `'primitive'`/`'union'`/... inline wherever a `DataType`'s shape is checked.
 * @type {const}
 */
export const DataTypeKind = {
    Primitive: 'primitive',
    Union: 'union',
    Array: 'array'
} as const;

/** Unified type extracting values from the `DataTypeKind` constant registry. */
export type DataTypeKind = typeof DataTypeKind[keyof typeof DataTypeKind];

/** A single primitive, e.g. `texto`. */
export interface PrimitiveDataType {
    kind: typeof DataTypeKind.Primitive;
    name: PrimitiveTypeName;
}

/**
 * A union of two or more distinct primitives, e.g. `texto|numero`. Never holds a single member —
 * {@link unionOf} collapses that case down to a bare `PrimitiveDataType` instead, mirroring how
 * TypeScript itself never represents a one-member union as a `UnionType`.
 */
export interface UnionDataType {
    kind: typeof DataTypeKind.Union;
    members: PrimitiveDataType[];
}

/** A homogeneous array of some other `DataType` (its `element`), e.g. `texto[]` or
 * `(texto|numero)[]`. */
export interface ArrayDataType {
    kind: typeof DataTypeKind.Array;
    element: DataType;
}

/**
 * The structural model for everything a `var` declaration's `dataType` can be. Used by both
 * `VariableNode.dataType` (what was written/parsed) and `Symbol.dataType` (what was ultimately
 * resolved) — see each field's own doc comment for how their meanings differ. Always built via
 * {@link primitive}/{@link unionOf}/{@link arrayOf}, compared via {@link isAssignable}, and
 * rendered to text via {@link formatDataType} — never hand-assembled or string-compared directly.
 */
export type DataType = PrimitiveDataType | UnionDataType | ArrayDataType;

/** Builds a bare primitive `DataType`. */
export function primitive (name: PrimitiveTypeName): PrimitiveDataType {
    return { kind: DataTypeKind.Primitive, name };
}

/**
 * Builds the `DataType` for a set of one or more primitive kinds, deduplicated: a single distinct
 * kind collapses to a bare {@link PrimitiveDataType} (matching TypeScript's own collapsing of a
 * one-member union); two or more become a {@link UnionDataType}, in the order first encountered
 * (order carries no meaning for a union — see {@link isAssignable} — but member order is kept
 * stable for readable, deterministic {@link formatDataType} output).
 * @param {PrimitiveTypeName[]} kinds - The primitive kinds the type is a union of (always at least
 * one).
 * @returns {DataType} The resulting primitive or union type.
 */
export function unionOf (kinds: PrimitiveTypeName[]): DataType {
    const unique = Array.from(new Set(kinds));

    return unique.length === 1
        ? primitive(unique[0])
        : { kind: DataTypeKind.Union, members: unique.map(primitive) };
}

/** Builds a homogeneous array `DataType` of `element`. */
export function arrayOf (element: DataType): ArrayDataType {
    return { kind: DataTypeKind.Array, element };
}

/**
 * Whether a value of type `source` can be used where `target` is expected — the same "is this
 * assignable" question TypeScript's checker answers structurally, recursively, over its own `Type`
 * tree, rather than by comparing display strings:
 *  - if `source` is a union, *every* member must be assignable to `target` (assigning a broader
 *    type requires the narrower target to accept everything the source could actually be);
 *  - if `target` is a union, a (non-union) source is assignable as long as *some* member of
 *    `target` accepts it;
 *  - two primitives are assignable only when they name the same kind;
 *  - two arrays are assignable when their element types are (recursively).
 * Anything else (a primitive vs. an array, ...) isn't assignable.
 * @param {DataType} target - The declared/expected type.
 * @param {DataType} source - The type being checked against it.
 * @returns {boolean} Whether `source` is assignable to `target`.
 */
export function isAssignable (target: DataType, source: DataType): boolean {
    if (source.kind === DataTypeKind.Union) return source.members.every(member => isAssignable(target, member));
    if (target.kind === DataTypeKind.Union) return target.members.some(member => isAssignable(member, source));

    if (target.kind === DataTypeKind.Primitive && source.kind === DataTypeKind.Primitive) return target.name === source.name;
    if (target.kind === DataTypeKind.Array && source.kind === DataTypeKind.Array) return isAssignable(target.element, source.element);

    return false;
}

/**
 * Renders a `DataType` to the text a user sees (in a `tipo` annotation's error message, e.g.) —
 * the single place that ever turns the tree into a string, so every message is built the same way
 * instead of each caller re-deriving its own text. A union's members are shown alphabetically
 * sorted (`'numero|texto'`), independent of the order they were built in, so the same set of kinds
 * always displays identically.
 * @param {DataType} dataType - The type to render.
 * @returns {string} Its display form.
 */
export function formatDataType (dataType: DataType): string {
    switch (dataType.kind) {
        case DataTypeKind.Primitive: return dataType.name;
        case DataTypeKind.Union: return dataType.members.map(member => member.name).sort().join('|');
        case DataTypeKind.Array: return `${formatDataType(dataType.element)}[]`;
    }
}
