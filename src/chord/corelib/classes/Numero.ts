import { AnyDataType, PrimitiveDataType } from "../../model/DataType";

export const numeroClass = {
    receiver: PrimitiveDataType.Numero,
    methods: {
        esEntero: {
            transpile: 'Number.isInteger',
            returns: PrimitiveDataType.Booleano,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si el valor es un número entero.'
        },
        esNumero: {
            transpile: 'Number.isFinite',
            returns: PrimitiveDataType.Booleano,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si el valor es un número finito.'
        },
        esEnteroSeguro: {
            transpile: 'Number.isSafeInteger',
            returns: PrimitiveDataType.Booleano,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si el valor es un entero que se representa sin pérdida.'
        },
        esNaN: {
            transpile: 'Number.isNaN',
            returns: PrimitiveDataType.Booleano,
            static: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si el valor es NaN.'
        },
        aEntero: {
            transpile: 'parseInt',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'texto',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'base',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Convierte un texto en un número entero.'
        },
        aDecimal: {
            transpile: 'parseFloat',
            returns: PrimitiveDataType.Numero,
            static: true,
            params: [
                {
                    name: 'texto',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Convierte un texto en un número decimal.'
        },
        aFijo: {
            transpile: 'toFixed',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'decimales',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Texto con la cantidad de decimales dada.'
        },
        aPrecision: {
            transpile: 'toPrecision',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'precision',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Texto con la cantidad de cifras significativas dada.'
        },
        aTexto: {
            transpile: 'toString',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'base',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Texto del número, en la base dada.'
        },
        aLocal: {
            transpile: 'toLocaleString',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'idioma',
                    type: PrimitiveDataType.Texto,
                    optional: true
                }
            ],
            doc: 'Texto del número según el idioma.'
        }
    },
    properties: {
        MAXIMO_SEGURO: {
            transpile: 'Number.MAX_SAFE_INTEGER',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Mayor entero que se representa sin pérdida.'
        },
        MINIMO_SEGURO: {
            transpile: 'Number.MIN_SAFE_INTEGER',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Menor entero que se representa sin pérdida.'
        },
        MAXIMO: {
            transpile: 'Number.MAX_VALUE',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Mayor número representable.'
        },
        MINIMO: {
            transpile: 'Number.MIN_VALUE',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Menor número positivo representable.'
        },
        EPSILON: {
            transpile: 'Number.EPSILON',
            returns: PrimitiveDataType.Numero,
            static: true,
            doc: 'Diferencia entre 1 y el siguiente número representable.'
        }
    }
} as const;
