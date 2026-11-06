import { BDOSchema, JSFallback } from "../../../../chord/BDOSchema";
import { ChannelProperty, DisChordNode, DisChordNodeType } from "../../../types";
import { SchemaFields } from "./SchemaFields";

/**
 * An `enviar mensaje { ... }`'s own plain properties (`boton`/`embed` are resolved separately, by
 * `ButtonVisitor`/`EmbedVisitor`). Neither is required, so nothing here needs Analyzer validation;
 * `MessageVisitor` is this schema's only reader.
 */
export const MessageSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'mensaje',
    passthrough: ['boton', 'embed'],
    fields: [
        SchemaFields.value(ChannelProperty.Canal, JSFallback.Undefined),
        SchemaFields.value('usuario', JSFallback.Undefined),
        SchemaFields.value('contenido', JSFallback.Undefined)
    ]
};
