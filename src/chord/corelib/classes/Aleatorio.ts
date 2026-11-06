import { AnyDataType, ArrayDataType, PrimitiveDataType } from "../../model/DataType";

export const aleatorioClass = {
    methods: {
        elegir: {
            transpile: 'chordElegir',
            returns: AnyDataType.Any,
            static: true,
            params: [
                {
                    name: 'lista',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Elige un elemento al azar de la lista.'
        },
        mezclar: {
            transpile: 'chordMezclar',
            returns: ArrayDataType.AnyList,
            static: true,
            params: [
                {
                    name: 'lista',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve una copia de la lista con el orden al azar.'
        },
        entre: {
            transpile: 'chordEntre',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'minimo',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'maximo',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Número entero al azar entre dos valores, ambos incluidos.'
        }
    }
} as const;
