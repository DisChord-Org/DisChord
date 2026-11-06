import { AnyDataType, PrimitiveDataType } from "../../model/DataType";

export const jsonClass = {
    methods: {
        leer: {
            transpile: 'JSON.parse',
            returns: AnyDataType.Any,
            static: true,
            params: [
                {
                    name: 'texto',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Convierte un texto JSON en un valor.'
        },
        escribir: {
            transpile: 'JSON.stringify',
            returns: PrimitiveDataType.Texto,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                },
                {
                    name: 'reemplazo',
                    type: AnyDataType.Any,
                    optional: true
                },
                {
                    name: 'espacios',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Convierte un valor en un texto JSON.'
        }
    }
} as const;
