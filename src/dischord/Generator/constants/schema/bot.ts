import { BDOSchema, FieldKind } from "../../../../chord/BDOSchema";
import { DisChordNode, DisChordNodeType } from "../../../types";
import { intentsMap } from "../mappings";
import { SchemaFields } from "./SchemaFields";

/**
 * `encender bot`'s own schema: `prefijo`/`prefijos` (synonyms) and `token` are required;
 * `intenciones`, when it's a list, must only name intents `intentsMap` recognizes (a non-list
 * `intenciones` is silently treated as absent, matching `ClientInitVisitor`'s own "only read
 * intents when the field is a list at all"). Validation-only — see `schemas.ts`'s doc comment for
 * why `ClientInitVisitor` doesn't resolve it through `BDOResolver`.
 */
export const StartBotSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'encender bot',
    fields: [
        {
            key: [ 'prefijo', 'prefijos' ],
            kind: FieldKind.Value,
            required: true,
            missingMessage: `No se ha especificado el prefijo en el bloque 'encender bot'`
        },
        SchemaFields.required('token', `Falta el bloque 'token' en la configuración del bot.`),
        {
            key: 'intenciones',
            kind: FieldKind.MappedList,
            mapping: intentsMap,
            unknownMessage: value => `Intención desconocida: ${value}`
        }
    ]
};

