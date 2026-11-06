import { BDOSchema, FieldKind, JSFallback } from "../../../../chord/BDOSchema";
import { ButtonStyles, DisChordNode, DisChordNodeType } from "../../../types";
import { SchemaFields } from "./SchemaFields";

/**
 * A button's own properties: `id`, `etiqueta`, `estilo` are required; the optional `emoji`
 * defaults to `JSFallback.Empty` so `ButtonVisitor` can omit `.setEmoji(...)` entirely when absent.
 */
export const ButtonSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'boton',
    fields: [
        SchemaFields.required('id', `Se debe especificar una id en el botón`),
        SchemaFields.required('etiqueta', `Se debe especificar una etiqueta en el botón`),
        {
            key: 'estilo',
            kind: FieldKind.MappedLiteral,
            mapping: ButtonStyles,
            required: true,
            missingMessage: `Se debe especificar el estilo en el botón`,
            unknownMessage: value => `Estilo inválido: '${value}'`
        },
        SchemaFields.value('emoji', JSFallback.Empty)
    ]
};
