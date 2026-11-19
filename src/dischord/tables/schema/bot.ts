import { BDOSchema, FieldKind, fieldKeys } from "../../../chord/BDOSchema";
import { ArrayDataType, PrimitiveDataType, UnionDataType } from "../../../chord/model/DataType";
import { DisChordNode, DisChordNodeType, StartBotNode } from "../../types";
import { intentsMap } from "../mappings";
import { SchemaFields } from "./SchemaFields";

/**
 * The keys `StartBotSchema` declares, synonyms included.
 * @returns {string[]} `prefijo`, `prefijos`, `token`, `intenciones`...
 */
export function startBotDeclaredKeys (): string[] {
    return StartBotSchema.fields.flatMap(field => fieldKeys(field.key));
}

/**
 * The keys of an `encender bot` block that the schema doesn't declare, with their values: the
 * custom properties of `cliente`.
 * @param {StartBotNode['object']} object - The block of `encender bot`.
 * @returns {[string, DisChordNode][]} Each custom key with its value node, in source order.
 */
export function startBotCustomEntries (object: StartBotNode['object']): [ string, DisChordNode ][] {
    return Object.entries(object.blocks).filter(([ key ]) => !startBotDeclaredKeys().includes(key)) as [ string, DisChordNode ][];
}

/**
 * `encender bot`'s own schema: `prefijo`/`prefijos` (synonyms) and `token` are required;
 * every other key is a custom property set on `cliente` (see {@link startBotCustomEntries});
 * `intenciones` must be a list that only names intents `intentsMap` recognizes (`ClientInitVisitor`
 * only reads intents from a list, so anything else would leave the bot without them). Validation-only — see `schemas.ts`'s doc comment for
 * why `ClientInitVisitor` doesn't resolve it through `BDOResolver`.
 */
export const StartBotSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'encender bot',
    open: true,
    fields: [
        {
            key: [ 'prefijo', 'prefijos' ],
            kind: FieldKind.Value,
            required: true,
            missingMessage: `No se ha especificado el prefijo en el bloque 'encender bot'`,
            type: UnionDataType.ofTypes([ PrimitiveDataType.Texto, ArrayDataType.of(PrimitiveDataType.Texto) ])
        },
        SchemaFields.required('token', `Falta el bloque 'token' en la configuración del bot.`, PrimitiveDataType.Texto),
        {
            key: 'intenciones',
            kind: FieldKind.MappedList,
            mapping: intentsMap,
            invalidMessage: `'intenciones' debe ser una lista de intenciones: intenciones [ "Servidores", "MensajesDelServidor" ]`,
            unknownMessage: value => `Intención desconocida: ${value}`
        }
    ]
};

