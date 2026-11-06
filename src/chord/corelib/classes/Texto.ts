import { PrimitiveDataType, ArrayDataType, AnyDataType, UnionDataType } from "../../model/DataType";
import { PrimitiveType } from "../../model/types";

export const textoClass = {
    receiver: PrimitiveDataType.Texto,
    methods: {
        limpiar: {
            transpile: 'trim',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'Quita los espacios del principio y del final.'
        },
        partir: {
            transpile: 'split',
            returns: ArrayDataType.of(PrimitiveDataType.Texto),
            params: [
                {
                    name: 'separador',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'limite',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Divide el texto en una lista por cada aparición del separador.'
        },
        reemplazar: {
            transpile: 'replace',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'buscado',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'reemplazo',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Reemplaza la primera aparición de lo buscado.'
        },
        reemplazarTodo: {
            transpile: 'replaceAll',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'buscado',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'reemplazo',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Reemplaza todas las apariciones de lo buscado.'
        },
        terminaCon: {
            transpile: 'endsWith',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'final',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Indica si el texto termina con el valor dado.'
        },
        empiezaCon: {
            transpile: 'startsWith',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Indica si el texto empieza con el valor dado.'
        },
        repetir: {
            transpile: 'repeat',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'veces',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Repite el texto el número de veces dado.'
        },
        cortar: {
            transpile: 'slice',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'fin',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Devuelve la parte del texto entre dos posiciones.'
        },
        minusculas: {
            transpile: 'toLowerCase',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'Convierte el texto a minúsculas.'
        },
        mayusculas: {
            transpile: 'toUpperCase',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'Convierte el texto a mayúsculas.'
        },
        tiene: {
            transpile: 'includes',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'buscado',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'posicion',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Indica si el texto contiene lo buscado.'
        },
        indiceDe: {
            transpile: 'indexOf',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'buscado',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'posicion',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Posición de la primera aparición de lo buscado, o -1.'
        },
        ultimoIndiceDe: {
            transpile: 'lastIndexOf',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'buscado',
                    type: PrimitiveDataType.Texto
                },
                {
                    name: 'posicion',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Posición de la última aparición de lo buscado, o -1.'
        },
        caracterEn: {
            transpile: 'charAt',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'indice',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Carácter en la posición dada.'
        },
        rellenarInicio: {
            transpile: 'padStart',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'longitud',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'relleno',
                    type: PrimitiveDataType.Texto,
                    optional: true
                }
            ],
            doc: 'Rellena el principio hasta alcanzar la longitud dada.'
        },
        rellenarFinal: {
            transpile: 'padEnd',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'longitud',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'relleno',
                    type: PrimitiveDataType.Texto,
                    optional: true
                }
            ],
            doc: 'Rellena el final hasta alcanzar la longitud dada.'
        },
        concatenar: {
            transpile: 'concat',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'textos',
                    type: PrimitiveDataType.Texto,
                    rest: true
                }
            ],
            doc: 'Une el texto con los que se le pasan.'
        },
        recortarInicio: {
            transpile: 'trimStart',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'Quita los espacios del principio.'
        },
        recortarFinal: {
            transpile: 'trimEnd',
            returns: PrimitiveDataType.Texto,
            params: [],
            doc: 'Quita los espacios del final.'
        },
        normalizar: {
            transpile: 'normalize',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'forma',
                    type: PrimitiveDataType.Texto,
                    optional: true
                }
            ],
            doc: 'Normaliza el texto Unicode.'
        },
        coincidir: {
            transpile: 'match',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'patron',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Busca coincidencias con una expresión.'
        },
        coincidirTodo: {
            transpile: 'matchAll',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'patron',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Busca todas las coincidencias con una expresión.'
        },
        buscar: {
            transpile: 'search',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'patron',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Posición de la primera coincidencia con una expresión, o -1.'
        },
        codigoEn: {
            transpile: 'charCodeAt',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'indice',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Código Unicode del carácter en la posición dada.'
        },
        subcadena: {
            transpile: 'substring',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'fin',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Devuelve la parte del texto entre dos posiciones.'
        },
        comparar: {
            transpile: 'localeCompare',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'otro',
                    type: PrimitiveDataType.Texto
                }
            ],
            doc: 'Compara con otro texto: negativo, 0 o positivo.'
        },
        en: {
            transpile: 'at',
            returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
            params: [
                {
                    name: 'indice',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Carácter en la posición dada; admite negativos para contar desde el final.'
        },
    },
    properties: {
        longitud: {
            transpile: 'length',
            returns: PrimitiveDataType.Numero,
            doc: 'Cantidad de caracteres del texto.'
        }
    }
} as const;
