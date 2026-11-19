import { BDOSchema, FieldKind, JSFallback } from "../../../chord/BDOSchema";
import { PrimitiveDataType, UnionDataType } from "../../../chord/model/DataType";
import { EmbedColors } from "../mappings";
import { DisChordNode, DisChordNodeType } from "../../types";
import { SchemaFields } from "./SchemaFields";

/** An embed field entry (`campos [ { titulo "..." descripcion "..." lineado verdadero } ]`). Only
 * `titulo` is required; `descripcion`/`lineado` are plain optional pass-throughs. */
export const EmbedFieldSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'campo',
    fields: [
        SchemaFields.required('titulo', `El campo requiere una propiedad 'titulo'`, PrimitiveDataType.Texto),
        SchemaFields.value('descripcion', JSFallback.Empty, PrimitiveDataType.Texto),
        SchemaFields.value('lineado', JSFallback.False)
    ]
};

/** An embed's footer (`pie { texto "..." icono "..." }`). Only `texto` is required. */
export const EmbedFooterSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'pie',
    fields: [
        SchemaFields.required('texto', `El pie de página requiere una propiedad 'texto'`, PrimitiveDataType.Texto),
        SchemaFields.value('icono', JSFallback.Undefined, PrimitiveDataType.Texto)
    ]
};

/**
 * An embed's author (`autor { nombre "..." icono "..." }`). Both are optional: the name falls back
 * to the username of whoever ran the command.
 */
export const EmbedAuthorSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'autor',
    fields: [
        SchemaFields.value('nombre', 'usuario.username', PrimitiveDataType.Texto),
        SchemaFields.value('icono', JSFallback.Undefined, PrimitiveDataType.Texto)
    ]
};

/**
 * An embed's own properties. The simple pass-through fields (`color`, `titulo`, `descripcion`,
 * `imagen`, `cartel`) default to `JSFallback.Empty` rather than `JSFallback.Undefined` so
 * `EmbedVisitor` can tell "absent" apart from a real value with a plain truthiness check, and omit
 * the whole `.setX(...)` call instead of passing an explicit `undefined` through to Seyfert.
 * `hora` is one of them too: it is the presence of the property that adds the timestamp, whatever its
 * value. `autor`, `campos` and `pie` nest their own schema, which is also what validates them.
 *
 * `color` is a name of {@link EmbedColors} when it is written as a text, and otherwise whatever
 * Discord resolves as a color (a number, or a text held in a variable): `EmbedVisitor` translates
 * the name and passes anything else through.
 */
export const EmbedSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'embed',
    fields: [
        {
            key: 'color',
            kind: FieldKind.NamedValue,
            mapping: EmbedColors,
            default: JSFallback.Empty,
            type: UnionDataType.ofTypes([ PrimitiveDataType.Texto, PrimitiveDataType.Numero ]),
            unknownMessage: value => `Color de embed desconocido: '${value}'. Se admite: ${Object.keys(EmbedColors).join(' / ')}. Para otro color, pasa un número o una variable.`
        },
        SchemaFields.value('titulo', JSFallback.Empty, PrimitiveDataType.Texto),
        SchemaFields.value('descripcion', JSFallback.Empty, PrimitiveDataType.Texto),
        SchemaFields.value('hora', JSFallback.Empty),
        SchemaFields.value('imagen', JSFallback.Empty, PrimitiveDataType.Texto),
        SchemaFields.value('cartel', JSFallback.Empty, PrimitiveDataType.Texto)
    ],
    nested: [
        { key: 'autor', schema: EmbedAuthorSchema },
        {
            key: 'campos',
            forEachItem: true,
            schema: EmbedFieldSchema,
            typeMismatchMessage: foundType => `Se esperaba un BDO para el campo, se recibió '${foundType}'`,
            invalidMessage: `'campos' debe ser una lista de bloques: campos [ { titulo "..." descripcion "..." } ]`
        },
        { key: 'pie', schema: EmbedFooterSchema, invalidMessage: `'pie' debe ser un bloque: pie { texto "..." }` }
    ]
};

