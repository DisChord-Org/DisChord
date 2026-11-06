import { BDOSchema, JSFallback } from "../../../../chord/BDOSchema";
import { DisChordNode, DisChordNodeType } from "../../../types";
import { SchemaFields } from "./SchemaFields";

/**
 * A `recolector`'s own behavioral properties — each a reference to a `funcion` declared elsewhere,
 * never inline code (see `CollectorVisitor`'s own doc comment). None are required or
 * closed-vocabulary, so nothing here needs Analyzer validation; `CollectorVisitor` is this
 * schema's only reader.
 */
export const CollectorSchema: BDOSchema<DisChordNodeType, DisChordNode> = {
    name: 'recolector',
    passthrough: ['alPulsarId'],
    fields: [
        SchemaFields.value('filtro', JSFallback.Empty),
        SchemaFields.value('tiempo', '60000'),
        SchemaFields.value('alFinalizar', JSFallback.Empty)
    ]
};
