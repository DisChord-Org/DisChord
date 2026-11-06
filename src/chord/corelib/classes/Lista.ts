import { ArrayDataType, PrimitiveDataType, AnyDataType, VoidDataType } from "../../model/DataType";

export const listaClass = {
    receiver: ArrayDataType.AnyList,
    methods: {
        agregar: {
            transpile: 'push',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'elementos',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Agrega elementos al final y devuelve la nueva longitud.'
        },
        quitarUltimo: {
            transpile: 'pop',
            returns: AnyDataType.Any,
            params: [],
            doc: 'Quita el último elemento y lo devuelve.'
        },
        quitarPrimero: {
            transpile: 'shift',
            returns: AnyDataType.Any,
            params: [],
            doc: 'Quita el primer elemento y lo devuelve.'
        },
        agregarInicio: {
            transpile: 'unshift',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'elementos',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Agrega elementos al inicio y devuelve la nueva longitud.'
        },
        unir: {
            transpile: 'join',
            returns: PrimitiveDataType.Texto,
            params: [
                {
                    name: 'separador',
                    type: PrimitiveDataType.Texto,
                    optional: true
                }
            ],
            doc: 'Une los elementos en un texto con el separador dado.'
        },
        mapear: {
            transpile: 'map',
            returns: ArrayDataType.AnyList,
            params: [
                {
                    name: 'accion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Crea una lista con el resultado de la función sobre cada elemento.'
        },
        llenar: {
            transpile: 'fill',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                },
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero,
                    optional: true
                },
                {
                    name: 'fin',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Rellena la lista con un valor entre dos posiciones.'
        },
        todos: {
            transpile: 'every',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'condicion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si todos los elementos cumplen la condición.'
        },
        algunos: {
            transpile: 'some',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'condicion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si algún elemento cumple la condición.'
        },
        filtrar: {
            transpile: 'filter',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'condicion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve los elementos que cumplen la condición.'
        },
        encontrar: {
            transpile: 'find',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'condicion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve el primer elemento que cumple la condición.'
        },
        tiene: {
            transpile: 'includes',
            returns: PrimitiveDataType.Booleano,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Indica si la lista contiene el valor.'
        },
        cortar: {
            transpile: 'slice',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero,
                    optional: true
                },
                {
                    name: 'fin',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Devuelve una copia de la parte de la lista entre dos posiciones.'
        },
        invertir: {
            transpile: 'reverse',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [],
            doc: 'Invierte el orden de la lista en su lugar.'
        },
        ordenar: {
            transpile: 'sort',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'comparador',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'Ordena la lista en su lugar.'
        },
        reducir: {
            transpile: 'reduce',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'accion',
                    type: AnyDataType.Any
                },
                {
                    name: 'inicial',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'Reduce la lista a un valor aplicando la función de izquierda a derecha.'
        },
        aplanar: {
            transpile: 'flat',
            returns: ArrayDataType.AnyList,
            params: [
                {
                    name: 'profundidad',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Aplana las listas anidadas hasta la profundidad dada.'
        },
        paraCada: {
            transpile: 'forEach',
            returns: VoidDataType.Void,
            params: [
                {
                    name: 'accion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Ejecuta la función con cada elemento.'
        },
        indiceDe: {
            transpile: 'indexOf',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                },
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Posición de la primera aparición del valor, o -1.'
        },
        ultimoIndiceDe: {
            transpile: 'lastIndexOf',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'valor',
                    type: AnyDataType.Any
                },
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Posición de la última aparición del valor, o -1.'
        },
        concatenar: {
            transpile: 'concat',
            returns: ArrayDataType.AnyList,
            params: [
                {
                    name: 'listas',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Une la lista con otras listas o valores en una nueva.'
        },
        buscarIndice: {
            transpile: 'findIndex',
            returns: PrimitiveDataType.Numero,
            params: [
                {
                    name: 'condicion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Posición del primer elemento que cumple la condición, o -1.'
        },
        encontrarUltimo: {
            transpile: 'findLast',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'condicion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Devuelve el último elemento que cumple la condición.'
        },
        aplanarMapear: {
            transpile: 'flatMap',
            returns: ArrayDataType.AnyList,
            params: [
                {
                    name: 'accion',
                    type: AnyDataType.Any
                }
            ],
            doc: 'Aplica la función a cada elemento y aplana el resultado un nivel.'
        },
        en: {
            transpile: 'at',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'posicion',
                    type: PrimitiveDataType.Numero
                }
            ],
            doc: 'Elemento en la posición dada; admite posiciones negativas.'
        },
        insertar: {
            transpile: 'splice',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'cantidad',
                    type: PrimitiveDataType.Numero,
                    optional: true
                },
                {
                    name: 'elementos',
                    type: AnyDataType.Any,
                    rest: true
                }
            ],
            doc: 'Inserta elementos desde una posición, como splice: quita la cantidad indicada antes de insertar.'
        },
        eliminar: {
            transpile: 'splice',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'inicio',
                    type: PrimitiveDataType.Numero
                },
                {
                    name: 'cantidad',
                    type: PrimitiveDataType.Numero,
                    optional: true
                }
            ],
            doc: 'Elimina elementos desde una posición y devuelve los eliminados.'
        },
        claves: {
            transpile: 'keys',
            returns: AnyDataType.Any,
            params: [],
            doc: 'Iterador con las posiciones de la lista.'
        },
        valores: {
            transpile: 'values',
            returns: AnyDataType.Any,
            params: [],
            doc: 'Iterador con los elementos de la lista.'
        },
        entradas: {
            transpile: 'entries',
            returns: AnyDataType.Any,
            params: [],
            doc: 'Iterador de pares posición y elemento.'
        },
        reducirDerecha: {
            transpile: 'reduceRight',
            returns: AnyDataType.Any,
            params: [
                {
                    name: 'accion',
                    type: AnyDataType.Any
                },
                {
                    name: 'inicial',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'Como reducir, pero de derecha a izquierda.'
        },
        copiarDentro: {
            transpile: 'copyWithin',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'destino',
                    type: PrimitiveDataType.Numero
                },
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
            doc: 'Copia una parte de la lista a otra posición dentro de ella.'
        },
        ordenarCopia: {
            transpile: 'toSorted',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [
                {
                    name: 'comparador',
                    type: AnyDataType.Any,
                    optional: true
                }
            ],
            doc: 'Devuelve una copia ordenada sin modificar la original.'
        },
        invertirCopia: {
            transpile: 'toReversed',
            returns: ArrayDataType.AnyList,
            returnsSameList: true,
            params: [],
            doc: 'Devuelve una copia invertida sin modificar la original.'
        },
    },
    properties: {
        longitud: {
            transpile: 'length',
            returns: PrimitiveDataType.Numero,
            doc: 'Cantidad de elementos de la lista.'
        }
    }
} as const;
