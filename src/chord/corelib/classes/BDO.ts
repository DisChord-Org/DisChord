import { AnyDataType, ArrayDataType, PrimitiveDataType } from "../../model/DataType";

export const bdoClass = {
    receiver: PrimitiveDataType.BDO,
    methods: {
        claves: {
            transpile: 'Object.keys',
            returns: ArrayDataType.of(PrimitiveDataType.Texto),
            static: true,
            params: [
                {
                    name: 'objeto',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Lista con los nombres de los campos del objeto.'
        },
        valores: {
            transpile: 'Object.values',
            returns: ArrayDataType.AnyList,
            static: true,
            params: [
                {
                    name: 'objeto',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Lista con los valores de los campos del objeto.'
        },
        entradas: {
            transpile: 'Object.entries',
            returns: ArrayDataType.AnyList,
            static: true,
            params: [
                {
                    name: 'objeto',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Lista de pares nombre y valor de los campos del objeto.'
        },
        unir: {
            transpile: 'Object.assign',
            returns: PrimitiveDataType.BDO,
            static: true,
            params: [
                {
                    name: 'destino',
                    type: AnyDataType.Any
                },
                {
                    name: 'fuentes',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Copia los campos de las fuentes en el destino y lo devuelve.'
        },
        congelar: {
            transpile: 'Object.freeze',
            returns: PrimitiveDataType.BDO,
            static: true,
            params: [
                {
                    name: 'objeto',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Impide cambiar el objeto y lo devuelve.'
        },
        desdeEntradas: {
            transpile: 'Object.fromEntries',
            returns: PrimitiveDataType.BDO,
            static: true,
            params: [
                {
                    name: 'entradas',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Crea un objeto a partir de una lista de pares nombre y valor.'
        },
        tienePropia: {
            transpile: 'Object.hasOwn',
            returns: PrimitiveDataType.Booleano,
            static: true,
            params: [
                {
                    name: 'objeto',
                    type: AnyDataType.Any
                },
                {
                    name: 'clave',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Indica si el objeto tiene el campo como propio.'
        }
    }
} as const;
