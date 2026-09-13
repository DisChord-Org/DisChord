import { ASTNode } from "../../../chord/types";
import { BDOSchema, FieldKind, JSFallback, literalStringValue } from "../../../chord/BDOSchema";
import { ApplicationIntegrationType, ButtonStyles, DisChordNode, DisChordNodeType, InteractionContextType } from "../../types";
import { ContextTypes, DisChordTypeMap, IgnoreCommandTypes, IntegrationTypes, intentsMap } from "./mappings";

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

/** `comando`'s own `opciones` entries: `miOpcion { opcion "texto" descripcion "..." requerido si }`. */
export function OptionSchema (
    optionName: string,
    entry: { blocks: Record<string, ASTNode<DisChordNodeType, DisChordNode>> }
): BDOSchema<DisChordNodeType, DisChordNode> {
    const optionType = (literalStringValue(entry.blocks['opcion']) ?? '').toLowerCase();

    return {
        fields: [
            {
                key: 'opcion',
                kind: FieldKind.MappedLiteral,
                mapping: DisChordTypeMap,
                required: true,
                missingMessage: `Tipo de opción no reconocido en '${optionName}'`,
                invalidMessage: `Tipo de opción no reconocido en '${optionName}'`,
                unknownMessage: () => `Tipo de opción no reconocido en '${optionName}'`
            },
            {
                key: 'descripcion',
                kind: FieldKind.Value,
                required: true,
                missingMessage: `En la declaración de la opción tipo '${optionType}', se esperaba 'descripcion'.`
            },
            {
                key: 'requerido',
                kind: FieldKind.Value,
                required: true,
                missingMessage: `En la declaración de la opción tipo '${optionType}', se esperaba 'requerido'.`
            }
        ]
    };
}

/** `comando`'s own properties (its command flags and `opciones`). */
export const CommandSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'descripcion', kind: FieldKind.Value, required: true, missingMessage: `Se requiere descripción para el comando` },
        { key: 'nsfw', kind: FieldKind.Value, default: JSFallback.False },
        {
            key: 'integraciones',
            kind: FieldKind.MappedList,
            mapping: IntegrationTypes,
            default: `[ ${ApplicationIntegrationType.GuildInstall} ]`,
            invalidMessage: `El campo 'integraciones' debe ser una lista de opciones`,
            unknownMessage: () => `En las integraciones solo se puede especificar: ${Object.keys(IntegrationTypes).join(' / ')}`
        },
        {
            key: 'contextos',
            kind: FieldKind.MappedList,
            mapping: ContextTypes,
            default: `[ ${InteractionContextType.Guild} ]`,
            invalidMessage: `El campo 'contextos' debe ser una lista de opciones`,
            unknownMessage: () => `En las integraciones solo se puede especificar: ${Object.keys(ContextTypes).join(' / ')}`
        },
        { key: 'servidoresPermitidos', kind: FieldKind.Value, default: JSFallback.Undefined },
        {
            key: 'ignorar',
            kind: FieldKind.MappedLiteral,
            mapping: IgnoreCommandTypes,
            default: JSFallback.Undefined,
            invalidMessage: `Solo se permite tipo TEXTO en 'ignorar'`,
            unknownMessage: () => `En 'ignorar' solo se puede especificar un TEXTO de: ${Object.keys(IgnoreCommandTypes).join(' / ')}`
        },
        { key: 'alias', kind: FieldKind.List, default: JSFallback.Undefined, invalidMessage: `Los alias deben ser una LISTA con valores tipo TEXTO` }
    ],
    nested: [
        { key: 'opciones', forEachEntry: true, schemaFor: OptionSchema }
    ]
};

/**
 * A button's own properties: `id`, `etiqueta`, `estilo` are required; the optional `emoji`
 * defaults to `JSFallback.Empty` so `ButtonVisitor` can omit `.setEmoji(...)` entirely when absent.
 */
export const ButtonSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'id', kind: FieldKind.Value, required: true, missingMessage: `Se debe especificar una id en el botón` },
        { key: 'etiqueta', kind: FieldKind.Value, required: true, missingMessage: `Se debe especificar una etiqueta en el botón` },
        {
            key: 'estilo',
            kind: FieldKind.MappedLiteral,
            mapping: ButtonStyles,
            required: true,
            missingMessage: `Se debe especificar el estilo en el botón`,
            unknownMessage: value => `Estilo inválido: '${value}'`
        },
        { key: 'emoji', kind: FieldKind.Value, default: JSFallback.Empty }
    ]
};

/** An embed field entry (`campos [ { titulo "..." descripcion "..." lineado verdadero } ]`). Only
 * `titulo` is required; `descripcion`/`lineado` are plain optional pass-throughs. */
export const EmbedFieldSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'titulo', kind: FieldKind.Value, required: true, missingMessage: `El campo requiere una propiedad 'titulo'` },
        { key: 'descripcion', kind: FieldKind.Value, default: JSFallback.Empty },
        { key: 'lineado', kind: FieldKind.Value, default: JSFallback.False }
    ]
};

/** An embed's footer (`pie { texto "..." icono "..." }`). Only `texto` is required. */
export const EmbedFooterSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'texto', kind: FieldKind.Value, required: true, missingMessage: `El pie de página requiere una propiedad 'texto'` },
        { key: 'icono', kind: FieldKind.Value, default: JSFallback.Undefined }
    ]
};

/**
 * An embed's own properties. The simple pass-through fields (`color`, `titulo`, `descripcion`,
 * `imagen`, `cartel`) default to `JSFallback.Empty` rather than `JSFallback.Undefined` so
 * `EmbedVisitor` can tell "absent" apart from a real value with a plain truthiness check, and omit
 * the whole `.setX(...)` call instead of passing an explicit `undefined` through to Seyfert.
 * `autor` (two sub-properties plus a default) and `hora` (presence alone, no value at all) don't
 * fit that shape and stay resolved by hand in `EmbedVisitor`; `campos`/`pie`'s own requirements are
 * validated here regardless.
 */
export const EmbedSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'color', kind: FieldKind.Value, default: JSFallback.Empty },
        { key: 'titulo', kind: FieldKind.Value, default: JSFallback.Empty },
        { key: 'descripcion', kind: FieldKind.Value, default: JSFallback.Empty },
        { key: 'imagen', kind: FieldKind.Value, default: JSFallback.Empty },
        { key: 'cartel', kind: FieldKind.Value, default: JSFallback.Empty }
    ],
    nested: [
        { key: 'campos', forEachItem: true, schema: EmbedFieldSchema, typeMismatchMessage: foundType => `Se esperaba un BDO para el campo, se recibió '${foundType}'` },
        { key: 'pie', schema: EmbedFooterSchema }
    ]
};

/**
 * `encender bot`'s own schema: `prefijo`/`prefijos` (synonyms) and `token` are required;
 * `intenciones`, when it's a list, must only name intents `intentsMap` recognizes (a non-list
 * `intenciones` is silently treated as absent, matching `ClientInitVisitor`'s own "only read
 * intents when the field is a list at all"). Validation-only — see this file's own doc comment for
 * why `ClientInitVisitor` doesn't resolve it through `BDOResolver`.
 */
export const StartBotSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        {
            key: [ 'prefijo', 'prefijos' ],
            kind: FieldKind.Value,
            required: true,
            missingMessage: `No se ha especificado el prefijo en el bloque 'encender bot'`
        },
        { key: 'token', kind: FieldKind.Value, required: true, missingMessage: `Falta el bloque 'token' en la configuración del bot.` },
        {
            key: 'intenciones',
            kind: FieldKind.MappedList,
            mapping: intentsMap,
            unknownMessage: value => `Intención desconocida: ${value}`
        }
    ]
};

/**
 * A `recolector`'s own behavioral properties — each a reference to a `funcion` declared elsewhere,
 * never inline code (see `CollectorVisitor`'s own doc comment). None are required or
 * closed-vocabulary, so nothing here needs Analyzer validation; `CollectorVisitor` is this
 * schema's only reader.
 */
export const CollectorSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'filtro', kind: FieldKind.Value, default: JSFallback.Empty },
        { key: 'tiempo', kind: FieldKind.Value, default: '60000' },
        { key: 'alFinalizar', kind: FieldKind.Value, default: JSFallback.Empty }
    ]
};

/**
 * An `enviar mensaje { ... }`'s own plain properties (`boton`/`embed` are resolved separately, by
 * `ButtonVisitor`/`EmbedVisitor`). Neither is required, so nothing here needs Analyzer validation;
 * `MessageVisitor` is this schema's only reader.
 */
export const MessageSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    fields: [
        { key: 'canal', kind: FieldKind.Value, default: JSFallback.Undefined },
        { key: 'contenido', kind: FieldKind.Value, default: JSFallback.Undefined }
    ]
};
