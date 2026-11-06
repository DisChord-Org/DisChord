/**
 * @file DataType.ts
 * @description `DataType` — the structural model behind a `var` declaration's `dataType` — mirrors
 * how TypeScript's own checker represents types internally: a real class hierarchy (a primitive, a
 * union of members, an array of an element type, ...), never a pre-serialized string. The string
 * you see in an error message (`'numero|texto[]'`) is a *display* produced by a node's own
 * {@link DataType.format}, the same way TS's checker only turns a `Type` into text when it needs to
 * show one to a user — comparison and compatibility ({@link DataType.isAssignableFrom}) always work
 * on the tree itself, structurally, never on that string.
 *
 * Each shape (primitive/union/array/tuple) is its own subclass of the abstract {@link DataType},
 * owning its own model, construction, assignability and formatting together — the same reason
 * `SubParser`/`SubGenerator`/`AnalysisRule` are one class per grammar rule/node kind/check instead
 * of a single class with a `switch` over all of them. Adding a new shape means adding one new
 * subclass that implements {@link DataType}'s abstract contract; forgetting a method is a compile
 * error, not a silently-wrong `return false` at the end of an `if`-chain.
 *
 * Kept apart from `types.ts` because that file is purely declarative (interfaces, type aliases,
 * `const` registries like `TokenType`/`PrimitiveType`), with no actual behavior; everything here is
 * real logic. `PrimitiveType`/`PrimitiveTypeName` themselves stay in `types.ts` — they're a plain
 * data registry, no different from `TokenType`. The classes live in `dataTypes/`; this file gathers
 * them so the rest of the compiler keeps importing from a single place.
 */

export * from "./dataTypes/base";
export * from "./dataTypes/simple";
export * from "./dataTypes/composite";
