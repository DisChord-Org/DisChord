import { BDOSchema, JSFallback } from "../../../../chord/BDOSchema";
import { DisChordNode, DisChordNodeType } from "../../../types";
import { SchemaFields } from "./SchemaFields";

/** An embed field entry (`campos [ { titulo "..." descripcion "..." lineado verdadero } ]`). Only
 * `titulo` is required; `descripcion`/`lineado` are plain optional pass-throughs. */
export const EmbedFieldSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'campo',
    fields: [
        SchemaFields.required('titulo', `El campo requiere una propiedad 'titulo'`),
        SchemaFields.value('descripcion', JSFallback.Empty),
        SchemaFields.value('lineado', JSFallback.False)
    ]
};

/** An embed's footer (`pie { texto "..." icono "..." }`). Only `texto` is required. */
export const EmbedFooterSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'pie',
    fields: [
        SchemaFields.required('texto', `El pie de página requiere una propiedad 'texto'`),
        SchemaFields.value('icono', JSFallback.Undefined)
    ]
};

/**
 * An embed's author (`autor { nombre "..." icono "..." }`). Both are optional: the name falls back
 * to the username of whoever ran the command.
 */
export const EmbedAuthorSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'autor',
    fields: [
        SchemaFields.value('nombre', 'usuario.username'),
        SchemaFields.value('icono', JSFallback.Undefined)
    ]
};

/**
 * An embed's own properties. The simple pass-through fields (`color`, `titulo`, `descripcion`,
 * `imagen`, `cartel`) default to `JSFallback.Empty` rather than `JSFallback.Undefined` so
 * `EmbedVisitor` can tell "absent" apart from a real value with a plain truthiness check, and omit
 * the whole `.setX(...)` call instead of passing an explicit `undefined` through to Seyfert.
 * `hora` is one of them too: it is the presence of the property that adds the timestamp, whatever its
 * value. `autor`, `campos` and `pie` nest their own schema, which is also what validates them.
 */
export const EmbedSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'embed',
    fields: [
        SchemaFields.value('color', JSFallback.Empty),
        SchemaFields.value('titulo', JSFallback.Empty),
        SchemaFields.value('descripcion', JSFallback.Empty),
        SchemaFields.value('hora', JSFallback.Empty),
        SchemaFields.value('imagen', JSFallback.Empty),
        SchemaFields.value('cartel', JSFallback.Empty)
    ],
    nested: [
        { key: 'autor', schema: EmbedAuthorSchema },
        { key: 'campos', forEachItem: true, schema: EmbedFieldSchema, typeMismatchMessage: foundType => `Se esperaba un BDO para el campo, se recibió '${foundType}'` },
        { key: 'pie', schema: EmbedFooterSchema }
    ]
};

