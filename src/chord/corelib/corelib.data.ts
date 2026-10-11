import { AnyDataType, ArrayDataType, ClassDataType, PrimitiveDataType, UnionDataType, VoidDataType } from "../model/DataType";
import { PrimitiveType } from "../types";
import { CoreLib } from "./corelib.types";

/**
 * Names of the classes provided by the core library. Used as the keys of `corelib.classes`.
 */
export enum ClassesEnum {
    consola = 'consola',
    Texto = 'Texto',
    Lista = 'Lista',
    Mates = 'Mates',
    Numero = 'Numero',
    JSON = 'JSON',
    BDO = 'BDO',
    Mapa = 'Mapa',
    Conjunto = 'Conjunto',
    Promesa = 'Promesa',
    Expresion = 'Expresion',
    Fecha = 'Fecha',
    Aleatorio = 'Aleatorio'
}

/**
 * Core library definition: maps every class, and each of its methods and properties, from its
 * name in the source language to the JavaScript it is transpiled to. `functions` holds free
 * functions rewritten to another callee; layers built on top of chord add their own. A
 * `transpile` that names a `runtimeHelperNames` function is provided by the runtime helpers module.
 * @type {CoreLib<ClassesEnum>}
 */
export const corelib = {
    classes: {
        [ClassesEnum.consola]: {
            methods: {
                imprimir: {
                    transpile: 'console.log',
                    returns: VoidDataType.Void,
                    static: true
                },
                error: {
                    transpile: 'console.error',
                    returns: VoidDataType.Void,
                    static: true
                },
                advertencia: {
                    transpile: 'console.warn',
                    returns: VoidDataType.Void,
                    static: true
                },
                limpiar: {
                    transpile: 'console.clear',
                    returns: VoidDataType.Void,
                    static: true
                }
            }
        },
        [ClassesEnum.Texto]: {
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
                    params: [{ name: 'separador', type: PrimitiveDataType.Texto }, { name: 'limite', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Divide el texto en una lista por cada aparición del separador.'
                },
                reemplazar: {
                    transpile: 'replace',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'reemplazo', type: PrimitiveDataType.Texto }],
                    doc: 'Reemplaza la primera aparición de lo buscado.'
                },
                reemplazarTodo: {
                    transpile: 'replaceAll',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'reemplazo', type: PrimitiveDataType.Texto }],
                    doc: 'Reemplaza todas las apariciones de lo buscado.'
                },
                terminaCon: {
                    transpile: 'endsWith',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'final', type: PrimitiveDataType.Texto }],
                    doc: 'Indica si el texto termina con el valor dado.'
                },
                empiezaCon: {
                    transpile: 'startsWith',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'inicio', type: PrimitiveDataType.Texto }],
                    doc: 'Indica si el texto empieza con el valor dado.'
                },
                repetir: {
                    transpile: 'repeat',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'veces', type: PrimitiveDataType.Numero }],
                    doc: 'Repite el texto el número de veces dado.'
                },
                cortar: {
                    transpile: 'slice',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'inicio', type: PrimitiveDataType.Numero }, { name: 'fin', type: PrimitiveDataType.Numero, optional: true }],
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
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'posicion', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Indica si el texto contiene lo buscado.'
                },
                indiceDe: {
                    transpile: 'indexOf',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'posicion', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Posición de la primera aparición de lo buscado, o -1.'
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'posicion', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Posición de la última aparición de lo buscado, o -1.'
                },
                caracterEn: {
                    transpile: 'charAt',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'indice', type: PrimitiveDataType.Numero }],
                    doc: 'Carácter en la posición dada.'
                },
                rellenarInicio: {
                    transpile: 'padStart',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'longitud', type: PrimitiveDataType.Numero }, { name: 'relleno', type: PrimitiveDataType.Texto, optional: true }],
                    doc: 'Rellena el principio hasta alcanzar la longitud dada.'
                },
                rellenarFinal: {
                    transpile: 'padEnd',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'longitud', type: PrimitiveDataType.Numero }, { name: 'relleno', type: PrimitiveDataType.Texto, optional: true }],
                    doc: 'Rellena el final hasta alcanzar la longitud dada.'
                },
                concatenar: {
                    transpile: 'concat',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'textos', type: PrimitiveDataType.Texto, rest: true }],
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
                    params: [{ name: 'forma', type: PrimitiveDataType.Texto, optional: true }],
                    doc: 'Normaliza el texto Unicode.'
                },
                coincidir: {
                    transpile: 'match',
                    returns: AnyDataType.Any,
                    params: [{ name: 'patron', type: AnyDataType.Any }],
                    doc: 'Busca coincidencias con una expresión.'
                },
                coincidirTodo: {
                    transpile: 'matchAll',
                    returns: AnyDataType.Any,
                    params: [{ name: 'patron', type: AnyDataType.Any }],
                    doc: 'Busca todas las coincidencias con una expresión.'
                },
                buscar: {
                    transpile: 'search',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'patron', type: AnyDataType.Any }],
                    doc: 'Posición de la primera coincidencia con una expresión, o -1.'
                },
                codigoEn: {
                    transpile: 'charCodeAt',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'indice', type: PrimitiveDataType.Numero }],
                    doc: 'Código Unicode del carácter en la posición dada.'
                },
                subcadena: {
                    transpile: 'substring',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'inicio', type: PrimitiveDataType.Numero }, { name: 'fin', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Devuelve la parte del texto entre dos posiciones.'
                },
                comparar: {
                    transpile: 'localeCompare',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'otro', type: PrimitiveDataType.Texto }],
                    doc: 'Compara con otro texto: negativo, 0 o positivo.'
                },
                en: {
                    transpile: 'at',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido]),
                    params: [{ name: 'indice', type: PrimitiveDataType.Numero }],
                    doc: 'Carácter en la posición dada; admite negativos para contar desde el final.'
                }
            },
            properties: {
                longitud: {
                    transpile: 'length',
                    returns: PrimitiveDataType.Numero,
                    doc: 'Cantidad de caracteres del texto.'
                }
            }
        },
        [ClassesEnum.Lista]: {
            receiver: ArrayDataType.AnyList,
            methods: {
                agregar: {
                    transpile: 'push',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'elementos', type: AnyDataType.Any, rest: true }],
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
                    params: [{ name: 'elementos', type: AnyDataType.Any, rest: true }],
                    doc: 'Agrega elementos al inicio y devuelve la nueva longitud.'
                },
                unir: {
                    transpile: 'join',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'separador', type: PrimitiveDataType.Texto, optional: true }],
                    doc: 'Une los elementos en un texto con el separador dado.'
                },
                mapear: {
                    transpile: 'map',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'accion', type: AnyDataType.Any }],
                    doc: 'Crea una lista con el resultado de la función sobre cada elemento.'
                },
                llenar: {
                    transpile: 'fill',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'valor', type: AnyDataType.Any }, { name: 'inicio', type: PrimitiveDataType.Numero, optional: true }, { name: 'fin', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Rellena la lista con un valor entre dos posiciones.'
                },
                todos: {
                    transpile: 'every',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'condicion', type: AnyDataType.Any }],
                    doc: 'Indica si todos los elementos cumplen la condición.'
                },
                algunos: {
                    transpile: 'some',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'condicion', type: AnyDataType.Any }],
                    doc: 'Indica si algún elemento cumple la condición.'
                },
                filtrar: {
                    transpile: 'filter',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'condicion', type: AnyDataType.Any }],
                    doc: 'Devuelve los elementos que cumplen la condición.'
                },
                encontrar: {
                    transpile: 'find',
                    returns: AnyDataType.Any,
                    params: [{ name: 'condicion', type: AnyDataType.Any }],
                    doc: 'Devuelve el primer elemento que cumple la condición.'
                },
                tiene: {
                    transpile: 'includes',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Indica si la lista contiene el valor.'
                },
                cortar: {
                    transpile: 'slice',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'inicio', type: PrimitiveDataType.Numero, optional: true }, { name: 'fin', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Devuelve una copia de la parte de la lista entre dos posiciones.'
                },
                invertir: {
                    transpile: 'reverse',
                    returns: ArrayDataType.AnyList,
                    params: [],
                    doc: 'Invierte el orden de la lista en su lugar.'
                },
                ordenar: {
                    transpile: 'sort',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'comparador', type: AnyDataType.Any, optional: true }],
                    doc: 'Ordena la lista en su lugar.'
                },
                reducir: {
                    transpile: 'reduce',
                    returns: AnyDataType.Any,
                    params: [{ name: 'accion', type: AnyDataType.Any }, { name: 'inicial', type: AnyDataType.Any, optional: true }],
                    doc: 'Reduce la lista a un valor aplicando la función de izquierda a derecha.'
                },
                aplanar: {
                    transpile: 'flat',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'profundidad', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Aplana las listas anidadas hasta la profundidad dada.'
                },
                paraCada: {
                    transpile: 'forEach',
                    returns: VoidDataType.Void,
                    params: [{ name: 'accion', type: AnyDataType.Any }],
                    doc: 'Ejecuta la función con cada elemento.'
                },
                indiceDe: {
                    transpile: 'indexOf',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'valor', type: AnyDataType.Any }, { name: 'inicio', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Posición de la primera aparición del valor, o -1.'
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'valor', type: AnyDataType.Any }, { name: 'inicio', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Posición de la última aparición del valor, o -1.'
                },
                concatenar: {
                    transpile: 'concat',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'listas', type: AnyDataType.Any, rest: true }],
                    doc: 'Une la lista con otras listas o valores en una nueva.'
                },
                buscarIndice: {
                    transpile: 'findIndex',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'condicion', type: AnyDataType.Any }],
                    doc: 'Posición del primer elemento que cumple la condición, o -1.'
                },
                encontrarUltimo: {
                    transpile: 'findLast',
                    returns: AnyDataType.Any,
                    params: [{ name: 'condicion', type: AnyDataType.Any }],
                    doc: 'Devuelve el último elemento que cumple la condición.'
                },
                aplanarMapear: {
                    transpile: 'flatMap',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'accion', type: AnyDataType.Any }],
                    doc: 'Aplica la función a cada elemento y aplana el resultado un nivel.'
                },
                en: {
                    transpile: 'at',
                    returns: AnyDataType.Any,
                    params: [{ name: 'posicion', type: PrimitiveDataType.Numero }],
                    doc: 'Elemento en la posición dada; admite posiciones negativas.'
                },
                insertar: {
                    transpile: 'splice',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'inicio', type: PrimitiveDataType.Numero }, { name: 'cantidad', type: PrimitiveDataType.Numero, optional: true }, { name: 'elementos', type: AnyDataType.Any, rest: true }],
                    doc: 'Inserta elementos desde una posición, como splice: quita la cantidad indicada antes de insertar.'
                },
                eliminar: {
                    transpile: 'splice',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'inicio', type: PrimitiveDataType.Numero }, { name: 'cantidad', type: PrimitiveDataType.Numero, optional: true }],
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
                    params: [{ name: 'accion', type: AnyDataType.Any }, { name: 'inicial', type: AnyDataType.Any, optional: true }],
                    doc: 'Como reducir, pero de derecha a izquierda.'
                },
                copiarDentro: {
                    transpile: 'copyWithin',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'destino', type: PrimitiveDataType.Numero }, { name: 'inicio', type: PrimitiveDataType.Numero }, { name: 'fin', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Copia una parte de la lista a otra posición dentro de ella.'
                },
                ordenarCopia: {
                    transpile: 'toSorted',
                    returns: ArrayDataType.AnyList,
                    params: [{ name: 'comparador', type: AnyDataType.Any, optional: true }],
                    doc: 'Devuelve una copia ordenada sin modificar la original.'
                },
                invertirCopia: {
                    transpile: 'toReversed',
                    returns: ArrayDataType.AnyList,
                    params: [],
                    doc: 'Devuelve una copia invertida sin modificar la original.'
                }
            },
            properties: {
                longitud: {
                    transpile: 'length',
                    returns: PrimitiveDataType.Numero,
                    doc: 'Cantidad de elementos de la lista.'
                }
            }
        },
        [ClassesEnum.Mates]: {
            methods: {
                absoluto: {
                    transpile: 'Math.abs',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Valor sin signo.'
                },
                redondearArriba: {
                    transpile: 'Math.ceil',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Entero más cercano hacia arriba.'
                },
                redondearAbajo: {
                    transpile: 'Math.floor',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Entero más cercano hacia abajo.'
                },
                redondear: {
                    transpile: 'Math.round',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Entero más cercano.'
                },
                truncar: {
                    transpile: 'Math.trunc',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Parte entera, sin decimales.'
                },
                potencia: {
                    transpile: 'Math.pow',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'base', type: PrimitiveDataType.Numero }, { name: 'exponente', type: PrimitiveDataType.Numero }],
                    doc: 'Base elevada al exponente.'
                },
                raizCuadrada: {
                    transpile: 'Math.sqrt',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Raíz cuadrada.'
                },
                raizCubica: {
                    transpile: 'Math.cbrt',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Raíz cúbica.'
                },
                hipotenusa: {
                    transpile: 'Math.hypot',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valores', type: PrimitiveDataType.Numero, rest: true }],
                    doc: 'Raíz cuadrada de la suma de los cuadrados de los valores.'
                },
                exponente: {
                    transpile: 'Math.exp',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'e elevado al valor.'
                },
                log: {
                    transpile: 'Math.log',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Logaritmo natural.'
                },
                log10: {
                    transpile: 'Math.log10',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Logaritmo en base 10.'
                },
                log2: {
                    transpile: 'Math.log2',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Logaritmo en base 2.'
                },
                seno: {
                    transpile: 'Math.sin',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Seno, con el ángulo en radianes.'
                },
                coseno: {
                    transpile: 'Math.cos',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Coseno, con el ángulo en radianes.'
                },
                tangente: {
                    transpile: 'Math.tan',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Tangente, con el ángulo en radianes.'
                },
                arcoseno: {
                    transpile: 'Math.asin',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Arcoseno, en radianes.'
                },
                arcocoseno: {
                    transpile: 'Math.acos',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Arcocoseno, en radianes.'
                },
                arcotangente: {
                    transpile: 'Math.atan',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Arcotangente, en radianes.'
                },
                arcotangente2: {
                    transpile: 'Math.atan2',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'ordenada', type: PrimitiveDataType.Numero }, { name: 'abscisa', type: PrimitiveDataType.Numero }],
                    doc: 'Ángulo, en radianes, del punto (x, y).'
                },
                senoHiperbolico: {
                    transpile: 'Math.sinh',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Seno hiperbólico.'
                },
                cosenoHiperbolico: {
                    transpile: 'Math.cosh',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Coseno hiperbólico.'
                },
                tangenteHiperbolica: {
                    transpile: 'Math.tanh',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Tangente hiperbólica.'
                },
                maximo: {
                    transpile: 'Math.max',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valores', type: PrimitiveDataType.Numero, rest: true }],
                    doc: 'El mayor de los valores.'
                },
                minimo: {
                    transpile: 'Math.min',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valores', type: PrimitiveDataType.Numero, rest: true }],
                    doc: 'El menor de los valores.'
                },
                aleatorio: {
                    transpile: 'Math.random',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [],
                    doc: 'Número aleatorio entre 0 (incluido) y 1 (excluido).'
                },
                signo: {
                    transpile: 'Math.sign',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Signo del valor'
                },
                arcosenoHiperbolico: {
                    transpile: 'Math.asinh',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Arcoseno hiperbólico.'
                },
                arcocosenoHiperbolico: {
                    transpile: 'Math.acosh',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Arcocoseno hiperbólico.'
                },
                arcotangenteHiperbolica: {
                    transpile: 'Math.atanh',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Arcotangente hiperbólica.'
                },
                redondearFlotante: {
                    transpile: 'Math.fround',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Valor como número de 32 bits.'
                },
                exponenteMenosUno: {
                    transpile: 'Math.expm1',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'e elevado al valor, menos 1.'
                },
                logMasUno: {
                    transpile: 'Math.log1p',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Logaritmo natural de 1 más el valor.'
                },
                ceroInicial: {
                    transpile: 'Math.clz32',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }],
                    doc: 'Cantidad de ceros a la izquierda en 32 bits.'
                },
                limitar: {
                    transpile: 'chordLimitar',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'valor', type: PrimitiveDataType.Numero }, { name: 'minimo', type: PrimitiveDataType.Numero }, { name: 'maximo', type: PrimitiveDataType.Numero }],
                    doc: 'Mantiene el valor dentro del rango dado.'
                }
            },
            properties: {
                PI: {
                    transpile: 'Math.PI',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'La constante π.'
                },
                E: {
                    transpile: 'Math.E',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'La constante e.'
                },
                LOGNEP2: {
                    transpile: 'Math.LN2',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Logaritmo natural de 2.'
                },
                LOGNEP10: {
                    transpile: 'Math.LN10',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Logaritmo natural de 10.'
                },
                LOG2E: {
                    transpile: 'Math.LOG2E',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Logaritmo en base 2 de e.'
                },
                LOG10E: {
                    transpile: 'Math.LOG10E',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Logaritmo en base 10 de e.'
                },
                RAIZCUADRADA1_2: {
                    transpile: 'Math.SQRT1_2',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Raíz cuadrada de 1/2.'
                },
                RAIZCUADRADA2: {
                    transpile: 'Math.SQRT2',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    doc: 'Raíz cuadrada de 2.'
                }
            }
        },
        [ClassesEnum.Numero]: {
            receiver: PrimitiveDataType.Numero,
            methods: {
                esEntero: {
                    transpile: 'Number.isInteger',
                    returns: PrimitiveDataType.Booleano,
                    static: true,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Indica si el valor es un número entero.'
                },
                esNumero: {
                    transpile: 'Number.isFinite',
                    returns: PrimitiveDataType.Booleano,
                    static: true,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Indica si el valor es un número finito.'
                },
                esEnteroSeguro: {
                    transpile: 'Number.isSafeInteger',
                    returns: PrimitiveDataType.Booleano,
                    static: true,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Indica si el valor es un entero que se representa sin pérdida.'
                },
                esNaN: {
                    transpile: 'Number.isNaN',
                    returns: PrimitiveDataType.Booleano,
                    static: true,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Indica si el valor es NaN.'
                },
                aEntero: {
                    transpile: 'parseInt',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'texto', type: PrimitiveDataType.Texto }, { name: 'base', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Convierte un texto en un número entero.'
                },
                aDecimal: {
                    transpile: 'parseFloat',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'texto', type: PrimitiveDataType.Texto }],
                    doc: 'Convierte un texto en un número decimal.'
                },
                aFijo: {
                    transpile: 'toFixed',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'decimales', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Texto con la cantidad de decimales dada.'
                },
                aPrecision: {
                    transpile: 'toPrecision',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'precision', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Texto con la cantidad de cifras significativas dada.'
                },
                aTexto: {
                    transpile: 'toString',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'base', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Texto del número, en la base dada.'
                },
                aLocal: {
                    transpile: 'toLocaleString',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'idioma', type: PrimitiveDataType.Texto, optional: true }],
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
        },
        [ClassesEnum.JSON]: {
            methods: {
                leer: {
                    transpile: 'JSON.parse',
                    returns: AnyDataType.Any,
                    static: true,
                    params: [{ name: 'texto', type: PrimitiveDataType.Texto }],
                    doc: 'Convierte un texto JSON en un valor.'
                },
                escribir: {
                    transpile: 'JSON.stringify',
                    returns: PrimitiveDataType.Texto,
                    static: true,
                    params: [{ name: 'valor', type: AnyDataType.Any }, { name: 'reemplazo', type: AnyDataType.Any, optional: true }, { name: 'espacios', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Convierte un valor en un texto JSON.'
                }
            }
        },
        [ClassesEnum.BDO]: {
            receiver: PrimitiveDataType.BDO,
            methods: {
                claves: {
                    transpile: 'Object.keys',
                    returns: ArrayDataType.of(PrimitiveDataType.Texto),
                    static: true,
                    params: [{ name: 'objeto', type: AnyDataType.Any }],
                    doc: 'Lista con los nombres de los campos del objeto.'
                },
                valores: {
                    transpile: 'Object.values',
                    returns: ArrayDataType.AnyList,
                    static: true,
                    params: [{ name: 'objeto', type: AnyDataType.Any }],
                    doc: 'Lista con los valores de los campos del objeto.'
                },
                entradas: {
                    transpile: 'Object.entries',
                    returns: ArrayDataType.AnyList,
                    static: true,
                    params: [{ name: 'objeto', type: AnyDataType.Any }],
                    doc: 'Lista de pares nombre y valor de los campos del objeto.'
                },
                unir: {
                    transpile: 'Object.assign',
                    returns: PrimitiveDataType.BDO,
                    static: true,
                    params: [{ name: 'destino', type: AnyDataType.Any }, { name: 'fuentes', type: AnyDataType.Any, rest: true }],
                    doc: 'Copia los campos de las fuentes en el destino y lo devuelve.'
                },
                congelar: {
                    transpile: 'Object.freeze',
                    returns: PrimitiveDataType.BDO,
                    static: true,
                    params: [{ name: 'objeto', type: AnyDataType.Any }],
                    doc: 'Impide cambiar el objeto y lo devuelve.'
                },
                desdeEntradas: {
                    transpile: 'Object.fromEntries',
                    returns: PrimitiveDataType.BDO,
                    static: true,
                    params: [{ name: 'entradas', type: AnyDataType.Any }],
                    doc: 'Crea un objeto a partir de una lista de pares nombre y valor.'
                },
                tienePropia: {
                    transpile: 'Object.hasOwn',
                    returns: PrimitiveDataType.Booleano,
                    static: true,
                    params: [{ name: 'objeto', type: AnyDataType.Any }, { name: 'clave', type: PrimitiveDataType.Texto }],
                    doc: 'Indica si el objeto tiene el campo como propio.'
                }
            }
        },
        [ClassesEnum.Mapa]: {
            receiver: ClassDataType.of(ClassesEnum.Mapa),
            constructs: 'Map',
            methods: {
                obtener: {
                    transpile: 'get',
                    returns: AnyDataType.Any,
                    params: [{ name: 'clave', type: AnyDataType.Any }],
                    doc: 'Devuelve el valor guardado para la clave.'
                },
                poner: {
                    transpile: 'set',
                    returns: ClassDataType.of(ClassesEnum.Mapa),
                    params: [{ name: 'clave', type: AnyDataType.Any }, { name: 'valor', type: AnyDataType.Any }],
                    doc: 'Guarda un valor para la clave y devuelve el mapa.'
                },
                tiene: {
                    transpile: 'has',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'clave', type: AnyDataType.Any }],
                    doc: 'Indica si hay un valor para la clave.'
                },
                borrar: {
                    transpile: 'delete',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'clave', type: AnyDataType.Any }],
                    doc: 'Borra la clave y devuelve si existía.'
                },
                limpiar: {
                    transpile: 'clear',
                    returns: VoidDataType.Void,
                    params: [],
                    doc: 'Borra todas las claves.'
                }
            },
            properties: {
                tamano: {
                    transpile: 'size',
                    returns: PrimitiveDataType.Numero,
                    doc: 'Cantidad de claves del mapa.'
                }
            }
        },
        /**
         * `tiene`, `borrar` and `limpiar` share their names with members of `Texto`, `Lista` or
         * `Mapa`. With a receiver of known type (`nuevo Conjunto()`, a typed variable) the class is
         * resolved from it; with an unknown one, such as a function parameter, the first class
         * declaring the name wins, so `c.tiene(x)` is emitted as `includes`, not `has`.
         */
        [ClassesEnum.Conjunto]: {
            receiver: ClassDataType.of(ClassesEnum.Conjunto),
            constructs: 'Set',
            methods: {
                agregar: {
                    transpile: 'add',
                    returns: ClassDataType.of(ClassesEnum.Conjunto),
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Agrega un valor y devuelve el conjunto.'
                },
                tiene: {
                    transpile: 'has',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Indica si el conjunto contiene el valor.'
                },
                borrar: {
                    transpile: 'delete',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'valor', type: AnyDataType.Any }],
                    doc: 'Quita el valor y devuelve si estaba.'
                },
                limpiar: {
                    transpile: 'clear',
                    returns: VoidDataType.Void,
                    params: [],
                    doc: 'Quita todos los valores.'
                }
            },
            properties: {
                tamano: {
                    transpile: 'size',
                    returns: PrimitiveDataType.Numero,
                    doc: 'Cantidad de valores del conjunto.'
                }
            }
        },
        [ClassesEnum.Promesa]: {
            receiver: ClassDataType.of(ClassesEnum.Promesa),
            constructs: 'Promise',
            methods: {
                todas: {
                    transpile: 'Promise.all',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true,
                    params: [{ name: 'promesas', type: AnyDataType.Any }],
                    doc: 'Espera a todas las promesas y devuelve la lista de resultados.'
                },
                todasResueltas: {
                    transpile: 'Promise.allSettled',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true,
                    params: [{ name: 'promesas', type: AnyDataType.Any }],
                    doc: 'Espera a que todas terminen y devuelve el estado de cada una.'
                },
                primera: {
                    transpile: 'Promise.race',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true,
                    params: [{ name: 'promesas', type: AnyDataType.Any }],
                    doc: 'Devuelve el resultado de la primera promesa en terminar.'
                },
                cualquiera: {
                    transpile: 'Promise.any',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true,
                    params: [{ name: 'promesas', type: AnyDataType.Any }],
                    doc: 'Devuelve el resultado de la primera promesa que se cumpla.'
                },
                resolver: {
                    transpile: 'Promise.resolve',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true,
                    params: [{ name: 'valor', type: AnyDataType.Any, optional: true }],
                    doc: 'Crea una promesa ya cumplida con el valor.'
                },
                rechazar: {
                    transpile: 'Promise.reject',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true,
                    params: [{ name: 'motivo', type: AnyDataType.Any, optional: true }],
                    doc: 'Crea una promesa ya rechazada con el motivo.'
                }
            }
        },
        [ClassesEnum.Expresion]: {
            receiver: ClassDataType.of(ClassesEnum.Expresion),
            constructs: 'RegExp',
            methods: {
                probar: {
                    transpile: 'test',
                    returns: PrimitiveDataType.Booleano,
                    params: [{ name: 'texto', type: PrimitiveDataType.Texto }],
                    doc: 'Indica si el texto cumple la expresión.'
                },
                ejecutar: {
                    transpile: 'exec',
                    returns: AnyDataType.Any,
                    params: [{ name: 'texto', type: PrimitiveDataType.Texto }],
                    doc: 'Busca la expresión en el texto y devuelve la coincidencia, o indefinido si no hay.'
                }
            }
        },
        [ClassesEnum.Fecha]: {
            receiver: ClassDataType.of(ClassesEnum.Fecha),
            constructs: 'Date',
            methods: {
                ahora: {
                    transpile: 'Date.now',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [],
                    doc: 'Marca de tiempo actual, en milisegundos.'
                },
                parsear: {
                    transpile: 'Date.parse',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'texto', type: PrimitiveDataType.Texto }],
                    doc: 'Convierte un texto de fecha en una marca de tiempo.'
                },
                año: {
                    transpile: 'getFullYear',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Año de la fecha.'
                },
                mes: {
                    transpile: 'getMonth',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Mes de la fecha, de 0 a 11.'
                },
                dia: {
                    transpile: 'getDate',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Día del mes de la fecha.'
                },
                diaSemana: {
                    transpile: 'getDay',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Día de la semana, de 0 (domingo) a 6.'
                },
                hora: {
                    transpile: 'getHours',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Hora de la fecha.'
                },
                minuto: {
                    transpile: 'getMinutes',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Minutos de la fecha.'
                },
                segundo: {
                    transpile: 'getSeconds',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Segundos de la fecha.'
                },
                milisegundo: {
                    transpile: 'getMilliseconds',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Milisegundos de la fecha.'
                },
                marcaDeTiempo: {
                    transpile: 'getTime',
                    returns: PrimitiveDataType.Numero,
                    params: [],
                    doc: 'Milisegundos transcurridos desde 1970.'
                },
                aISO: {
                    transpile: 'toISOString',
                    returns: PrimitiveDataType.Texto,
                    params: [],
                    doc: 'La fecha en formato ISO 8601.'
                },
                aTexto: {
                    transpile: 'toString',
                    returns: PrimitiveDataType.Texto,
                    params: [],
                    doc: 'La fecha como texto.'
                },
                aLocal: {
                    transpile: 'toLocaleString',
                    returns: PrimitiveDataType.Texto,
                    params: [{ name: 'idioma', type: PrimitiveDataType.Texto, optional: true }, { name: 'opciones', type: AnyDataType.Any, optional: true }],
                    doc: 'La fecha como texto según el idioma y las opciones dadas.'
                }
            }
        },
        [ClassesEnum.Aleatorio]: {
            methods: {
                elegir: {
                    transpile: 'chordElegir',
                    returns: AnyDataType.Any,
                    static: true,
                    params: [{ name: 'lista', type: AnyDataType.Any }],
                    doc: 'Elige un elemento al azar de la lista.'
                },
                mezclar: {
                    transpile: 'chordMezclar',
                    returns: ArrayDataType.AnyList,
                    static: true,
                    params: [{ name: 'lista', type: AnyDataType.Any }],
                    doc: 'Devuelve una copia de la lista con el orden al azar.'
                },
                entre: {
                    transpile: 'chordEntre',
                    returns: PrimitiveDataType.Numero,
                    static: true,
                    params: [{ name: 'minimo', type: PrimitiveDataType.Numero }, { name: 'maximo', type: PrimitiveDataType.Numero }],
                    doc: 'Número entero al azar entre dos valores, ambos incluidos.'
                }
            }
        }
    },
    functions: {
        esperar: 'chordEsperar'
    }
} as const satisfies CoreLib<ClassesEnum>;
