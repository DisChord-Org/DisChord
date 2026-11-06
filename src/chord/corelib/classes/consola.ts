import { AnyDataType, VoidDataType } from "../../model/DataType";

export const consolaClass = {
    methods: {
        imprimir: {
            transpile: 'console.log',
            returns: VoidDataType.Void,
            static: true,
            params: [
                {
                    name: 'valores',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Escribe los valores en la consola.'
        },
        error: {
            transpile: 'console.error',
            returns: VoidDataType.Void,
            static: true,
            params: [
                {
                    name: 'valores',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Escribe los valores en la consola como un error.'
        },
        advertencia: {
            transpile: 'console.warn',
            returns: VoidDataType.Void,
            static: true,
            params: [
                {
                    name: 'valores',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Escribe los valores en la consola como una advertencia.'
        },
        limpiar: {
            transpile: 'console.clear',
            returns: VoidDataType.Void,
            static: true,
            params: [],
            doc: 'Limpia la consola.'
        }
    }
} as const;
