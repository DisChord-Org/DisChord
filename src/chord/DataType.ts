import { PrimitiveTypeName } from "./types";

/**
 * @file DataType.ts
 * @description The `VariableDataType` family — the shape of what a `var` declaration's `dataType`
 * can be — and the two functions that build/read it. Split out of `types.ts` on purpose: that file
 * is purely declarative (interfaces, type aliases, `const` registries like `TokenType`/
 * `PrimitiveType`), with no actual behavior; `buildDataTypeName`/`parseDataTypeName` are real logic
 * (deduplicating, sorting, joining/splitting strings), so they don't belong there. `PrimitiveType`/
 * `PrimitiveTypeName` themselves stay in `types.ts` — they're a plain data registry, no different
 * from `TokenType`, whereas everything here is specifically about the union/array *encoding* built
 * on top of that registry.
 */

/**
 * The name of a homogeneous array of some `PrimitiveTypeName`, written `<nombre>[]` after `tipo`
 * (e.g. `tipo texto[]`) — a template literal type derived directly from `PrimitiveTypeName`, so
 * `'texto[]'` type-checks but `'text[]'` or `'texto[][]'` (nested arrays aren't supported) don't,
 * with no separate registry to keep in sync by hand.
 */
export type ArrayTypeName = `${PrimitiveTypeName}[]`;

/**
 * The canonical string form of a *set* of two or more distinct `PrimitiveTypeName`s (e.g.
 * `tipo (texto|numero)` -> `'numero|texto'`), always built by {@link buildDataTypeName} — members
 * deduplicated and sorted, so the same set of kinds always produces the exact same string
 * regardless of the order they were written/discovered in, and two `VariableDataType`s can be
 * compared for equality with plain `===`. Kept as a loose `string` rather than a precise template
 * literal type (unlike `PrimitiveTypeName`/`ArrayTypeName`) since TS can't express "every possible
 * sorted, deduplicated combination of a 5-member union" as a finite set of literal types — the
 * single builder function is what keeps this safe instead.
 */
export type PrimitiveUnionName = string;

/**
 * Every `dataType` a `var` declaration can resolve to: a bare primitive, a union of primitives, or
 * a homogeneous array of either. Used by both `VariableNode.dataType` (what was written/parsed)
 * and `Symbol.dataType` (what was ultimately resolved) — see each field's own doc comment for how
 * their meanings differ. Always built via {@link buildDataTypeName} and read back via
 * {@link parseDataTypeName} — never hand-assembled with string concatenation.
 */
export type VariableDataType = PrimitiveTypeName | ArrayTypeName | PrimitiveUnionName | `${PrimitiveUnionName}[]`;

/**
 * Builds the canonical `VariableDataType` string for a set of one or more primitive kinds — the
 * single place that ever joins primitive names together, so every caller (the parser building an
 * annotation, the Analyzer building an inferred type) produces identical strings for identical
 * sets and `===` stays a valid way to compare two `VariableDataType`s. A single kind collapses to
 * the bare `PrimitiveTypeName`/`ArrayTypeName` form (`'texto'`, `'texto[]'`); two or more are
 * deduplicated, sorted, and joined with `'|'` (`'numero|texto'`, `'numero|texto[]'`).
 * @param {PrimitiveTypeName[]} kinds - The primitive kinds the type is a union of (order doesn't
 * matter — always at least one).
 * @param {boolean} isArray - Whether this names an array of `kinds`, rather than a bare scalar.
 * @returns {VariableDataType} The canonical type name.
 */
export function buildDataTypeName (kinds: PrimitiveTypeName[], isArray: boolean): VariableDataType {
    const unique = Array.from(new Set(kinds)).sort();
    const base = unique.join('|');

    return (isArray ? `${base}[]` : base) as VariableDataType;
}

/**
 * The inverse of {@link buildDataTypeName}: reads a `VariableDataType` back into the individual
 * primitive kinds it names and whether it's an array of them.
 * @param {VariableDataType} dataType - A type name built by `buildDataTypeName`.
 * @returns {{ kinds: PrimitiveTypeName[]; isArray: boolean }} The decomposed type.
 */
export function parseDataTypeName (dataType: VariableDataType): { kinds: PrimitiveTypeName[]; isArray: boolean } {
    const isArray = dataType.endsWith('[]');
    const base = isArray ? dataType.slice(0, -2) : dataType;

    return { kinds: base.split('|') as PrimitiveTypeName[], isArray };
}
