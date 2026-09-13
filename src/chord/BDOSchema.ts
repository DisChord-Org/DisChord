import { ASTNode, BaseNode, LiteralNode, TokenType } from "./types";

/**
 * @file BDOSchema.ts
 * @description The declarative shape of a BDO's properties — what's required, what's a
 * closed-vocabulary value (and against which mapping), what's a plain pass-through expression, and
 * what nests another BDO/list of BDOs. One `BDOSchema` per dischord construct (`comando`, `boton`,
 * `embed`, ...) is the single source of truth both `chord/Analyzer/BDOValidator` (does this BDO
 * match the schema?) and `chord/Generator/BDOResolver` (what does the Generator get for each field?)
 * read — instead of the Analyzer and the Generator each re-declaring the same fields on their own,
 * one checking presence/vocabulary and the other re-reading the same properties to translate them.
 *
 * Deliberately has no notion of Discord, commands, or buttons — a schema is just data (field
 * names, mappings, messages, defaults) that a dischord module builds; this type only describes its
 * shape, so it belongs to chord (reusable by any future dialect), not dischord.
 */

/**
 * How a single field's value is interpreted. Named exactly like `TokenType`/`PrimitiveType` (a
 * `const` registry plus a type extracting its values) instead of writing `'value'`/`'mappedList'`/
 * ... inline wherever they're compared, for the same reason: a typo in `FieldKind.MappedList` is a
 * compiler error, a typo in a raw `'mappedList'` string is a silent runtime mismatch.
 *  - `Value`: a plain expression, passed through as-is (e.g. `descripcion`, `nsfw`) — the
 *    Analyzer only checks presence (if `required`); the Generator visits it directly.
 *  - `List`: like `Value`, but the Analyzer also checks it's a list when present (e.g.
 *    `alias`) — there's no mapping, so any list is accepted.
 *  - `MappedLiteral`: a single closed-vocabulary string (e.g. `ignorar`, `estilo`) — must be a
 *    key of `mapping` when present.
 *  - `MappedList`: a list of closed-vocabulary strings (e.g. `integraciones`, `intenciones`) —
 *    every element must be a key of `mapping` when present.
 * @type {const}
 */
export const FieldKind = {
    Value: 'value',
    List: 'list',
    MappedLiteral: 'mappedLiteral',
    MappedList: 'mappedList'
} as const;

/** Unified type extracting values from the `FieldKind` constant registry. */
export type FieldKind = typeof FieldKind[keyof typeof FieldKind];

/**
 * The JS source fragments a field falls back to at generation time when it's absent and declares
 * no `FieldSpec.default` of its own — named for the same reason `FieldKind`'s members are, rather
 * than writing `'undefined'`/`'[]'` inline wherever a fallback is produced.
 * @type {const}
 */
export const JSFallback = {
    Undefined: 'undefined',
    EmptyArray: '[]',
    False: 'false',
    /** Not a JS expression on its own — a sentinel a caller (e.g. `EmbedVisitor`) checks for
     * truthiness to decide whether to omit an optional `.setX(...)` call entirely, rather than
     * interpolating an explicit `undefined` into it. */
    Empty: ''
} as const;

/**
 * One field's full description: what it means, how to validate it, and what to fall back to when
 * generating code if it's absent.
 * @template M The enum/mapping value type for `'mappedLiteral'`/`'mappedList'` fields.
 */
export interface FieldSpec<M = unknown> {
    /** The property's key inside the BDO's `blocks`. An array names synonyms where any one may be
     * used (e.g. `['prefijo', 'prefijos']`) — the first one present wins. */
    key: string | string[];
    kind: FieldKind;
    /** Required for `'mappedLiteral'`/`'mappedList'`: the closed vocabulary this field's value(s)
     * must belong to. Ignored otherwise. */
    mapping?: Record<string, M>;
    /** Whether the field must be present at all. Defaults to `false`. */
    required?: boolean;
    /** The JS expression substituted at generation time when the field is absent (and not
     * `required` — an absent required field is already an analysis error). Defaults to
     * `'undefined'` (`'[]'` for `'mappedList'`). */
    default?: string;
    /** Message when `required` and the field is absent. */
    missingMessage?: string;
    /** Message when present but not the expected literal/list shape (`'list'`/`'mappedLiteral'`/
     * `'mappedList'` only). Omit to silently accept a differently-shaped value instead (e.g. a
     * dynamic expression only a later phase can resolve). */
    invalidMessage?: string;
    /** Message factory for a recognized-shape value that isn't a key of `mapping`
     * (`'mappedLiteral'`/`'mappedList'` only). */
    unknownMessage?: (value: string) => string;
}

/**
 * Describes a field whose value is itself one or more nested BDOs, each validated against
 * `schema` — e.g. a command's `opciones` (each entry its own BDO) or an embed's `campos` (a list of
 * BDOs). Only used by `BDOValidator`: a nested BDO's own fields are resolved separately, wherever
 * the Generator already loops over that field's entries for its own reasons (see
 * `CommandOptionVisitor`), rather than `BDOResolver` re-deriving that same loop.
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface NestedSpec<T extends string, N extends BaseNode<T>> {
    /** The property's key inside the parent BDO's `blocks`. */
    key: string;
    /** The schema every nested BDO found at `key` is checked against. Exactly one of `schema`/
     * `schemaFor` must be given. */
    schema?: BDOSchema<T, N>;
    /** Like `schema`, but built per entry — needed when a message must name the specific entry
     * (e.g. `"Tipo de opción no reconocido en '${optionName}'"`). Only meaningful with
     * `forEachEntry`; receives the entry's own key and its BDO. */
    schemaFor?: (entryKey: string, entry: ODBNodeLike<T, N>) => BDOSchema<T, N>;
    /** The field's value is itself a BDO whose own `blocks` are each a nested BDO to validate
     * (e.g. `opciones { miOpcion { ... } otraOpcion { ... } } }`). */
    forEachEntry?: boolean;
    /** The field's value is a list whose BDO elements are each validated (e.g. `campos [ { ... }
     * { ... } ]`). */
    forEachItem?: boolean;
    /** Message factory for a `forEachItem` list element that isn't a BDO, given the element's
     * actual node type. */
    typeMismatchMessage?: (foundType: string) => string;
}

/** Local alias avoiding a circular import with `types.ts` for {@link NestedSpec.schemaFor}'s
 * parameter type — structurally identical to `ODBNode<T, N>`. */
type ODBNodeLike<T extends string, N extends BaseNode<T>> = { blocks: Record<string, ASTNode<T, N>> };

/**
 * The complete declarative shape of one BDO — every dischord construct (`comando`, `boton`,
 * `embed`, `encender bot`, ...) defines exactly one of these, shared by validation and generation.
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface BDOSchema<T extends string, N extends BaseNode<T>> {
    fields: FieldSpec[];
    nested?: NestedSpec<T, N>[];
}

/**
 * Every key {@link FieldSpec.key}/{@link NestedSpec.key} might name, normalized to an array —
 * `'x'` becomes `['x']`, `['x', 'y']` is left as-is.
 */
export function fieldKeys (key: string | string[]): string[] {
    return Array.isArray(key) ? key : [ key ];
}

/**
 * Reads a node's value as a plain string, only when it's a string literal — the only shape a
 * closed-vocabulary check (an event name, an intent, a button style, an option type, ...) can
 * resolve without running the Generator. `undefined` for anything else (a reference, a property
 * access, a non-string literal, ...). Shared by `BDOValidator`, `BDOResolver`, and dischord's own
 * schema-building code (e.g. to read an option's own type while building its per-entry schema).
 */
export function literalStringValue<T extends string, N extends BaseNode<T>> (
    node: ASTNode<T, N> | undefined
): string | undefined {
    if (!node || node.type !== TokenType.LITERAL) return undefined;

    const value = (node as LiteralNode<T>).value;
    return typeof value === 'string' ? value : undefined;
}
