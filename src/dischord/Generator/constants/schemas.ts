/**
 * @file schemas.ts
 * @description Every dischord construct's `BDOSchema` lives here — the single source of truth for
 * its shape, regardless of who reads it. Most are read by both layers: the Analyzer
 * (`ValidateCommandRule`, `ValidateButtonsRule`, `ValidateEmbedsRule`) and the Generator
 * (`CommandVisitor`, `ButtonVisitor`, `EmbedVisitor`), via `chord/Analyzer/BDOValidator` and
 * `chord/Generator/BDOResolver` respectively. `StartBotSchema` is the exception — only
 * `ValidateStartBotRule` reads it, since `encender bot`'s generation side (`ClientInitVisitor`)
 * needs its `prefijo`/`prefijos` field's raw AST node (to detect an array value and scan it for
 * `/`) rather than just a resolved JS string, and writes two separate output artifacts — enough
 * bespoke shape that resolving it through `BDOResolver` wouldn't actually remove any duplication.
 * It still belongs here, not inlined into the rule: the schema is what a construct's shape *is*,
 * independent of which phase happens to consume it.
 *
 * Not every dischord construct has a schema at all: `recolector`'s `alPulsarId` (a
 * dynamically-keyed id→callback map, not a set of named fields) doesn't fit `BDOSchema`'s "named
 * fields" model, so `ValidateCollectorRule` validates it by hand instead.
 */

export * from "./schema/command";
export * from "./schema/button";
export * from "./schema/embed";
export * from "./schema/bot";
export * from "./schema/collector";
export * from "./schema/message";
export * from "./schema/channel";
export * from "./schema/moderation";
