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
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'desde', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Indica si el texto contiene lo buscado.'
                },
                indiceDe: {
                    transpile: 'indexOf',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'desde', type: PrimitiveDataType.Numero, optional: true }],
                    doc: 'Posición de la primera aparición de lo buscado, o -1.'
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf',
                    returns: PrimitiveDataType.Numero,
                    params: [{ name: 'buscado', type: PrimitiveDataType.Texto }, { name: 'desde', type: PrimitiveDataType.Numero, optional: true }],
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
                    returns: PrimitiveDataType.Numero
                },
                quitarUltimo: {
                    transpile: 'pop',
                    returns: AnyDataType.Any
                },
                quitarPrimero: {
                    transpile: 'shift',
                    returns: AnyDataType.Any
                },
                agregarInicio: {
                    transpile: 'unshift',
                    returns: PrimitiveDataType.Numero
                },
                unir: {
                    transpile: 'join',
                    returns: PrimitiveDataType.Texto
                },
                mapear: {
                    transpile: 'map',
                    returns: ArrayDataType.AnyList
                },
                llenar: {
                    transpile: 'fill',
                    returns: ArrayDataType.AnyList
                },
                todos: {
                    transpile: 'every',
                    returns: PrimitiveDataType.Booleano
                },
                algunos: {
                    transpile: 'some',
                    returns: PrimitiveDataType.Booleano
                },
                filtrar: {
                    transpile: 'filter',
                    returns: ArrayDataType.AnyList
                },
                encontrar: {
                    transpile: 'find',
                    returns: AnyDataType.Any
                },
                tiene: {
                    transpile: 'includes',
                    returns: PrimitiveDataType.Booleano
                },
                cortar: {
                    transpile: 'slice',
                    returns: ArrayDataType.AnyList
                },
                invertir: {
                    transpile: 'reverse',
                    returns: ArrayDataType.AnyList
                },
                ordenar: {
                    transpile: 'sort',
                    returns: ArrayDataType.AnyList
                },
                reducir: {
                    transpile: 'reduce',
                    returns: AnyDataType.Any
                },
                aplanar: {
                    transpile: 'flat',
                    returns: ArrayDataType.AnyList
                },
                paraCada: {
                    transpile: 'forEach',
                    returns: VoidDataType.Void
                },
                indiceDe: {
                    transpile: 'indexOf',
                    returns: PrimitiveDataType.Numero
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf',
                    returns: PrimitiveDataType.Numero
                },
                concatenar: {
                    transpile: 'concat',
                    returns: ArrayDataType.AnyList
                },
                buscarIndice: {
                    transpile: 'findIndex',
                    returns: PrimitiveDataType.Numero
                },
                encontrarUltimo: {
                    transpile: 'findLast',
                    returns: AnyDataType.Any
                },
                aplanarMapear: {
                    transpile: 'flatMap',
                    returns: ArrayDataType.AnyList
                },
                en: {
                    transpile: 'at',
                    returns: AnyDataType.Any
                },
                insertar: {
                    transpile: 'splice',
                    returns: ArrayDataType.AnyList
                },
                eliminar: {
                    transpile: 'splice',
                    returns: ArrayDataType.AnyList
                },
                claves: {
                    transpile: 'keys',
                    returns: AnyDataType.Any
                },
                valores: {
                    transpile: 'values',
                    returns: AnyDataType.Any
                },
                entradas: {
                    transpile: 'entries',
                    returns: AnyDataType.Any
                },
                reducirDerecha: {
                    transpile: 'reduceRight',
                    returns: AnyDataType.Any
                },
                copiarDentro: {
                    transpile: 'copyWithin',
                    returns: ArrayDataType.AnyList
                },
                ordenarCopia: {
                    transpile: 'toSorted',
                    returns: ArrayDataType.AnyList
                },
                invertirCopia: {
                    transpile: 'toReversed',
                    returns: ArrayDataType.AnyList
                }
            },
            properties: {
                longitud: {
                    transpile: 'length',
                    returns: PrimitiveDataType.Numero
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
                    params: [{ name: 'y', type: PrimitiveDataType.Numero }, { name: 'x', type: PrimitiveDataType.Numero }],
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
                    static: true
                },
                escribir: {
                    transpile: 'JSON.stringify',
                    returns: PrimitiveDataType.Texto,
                    static: true
                }
            }
        },
        [ClassesEnum.BDO]: {
            receiver: PrimitiveDataType.BDO,
            methods: {
                claves: {
                    transpile: 'Object.keys',
                    returns: ArrayDataType.of(PrimitiveDataType.Texto),
                    static: true
                },
                valores: {
                    transpile: 'Object.values',
                    returns: ArrayDataType.AnyList,
                    static: true
                },
                entradas: {
                    transpile: 'Object.entries',
                    returns: ArrayDataType.AnyList,
                    static: true
                },
                unir: {
                    transpile: 'Object.assign',
                    returns: PrimitiveDataType.BDO,
                    static: true
                },
                congelar: {
                    transpile: 'Object.freeze',
                    returns: PrimitiveDataType.BDO,
                    static: true
                },
                desdeEntradas: {
                    transpile: 'Object.fromEntries',
                    returns: PrimitiveDataType.BDO,
                    static: true
                },
                tienePropia: {
                    transpile: 'Object.hasOwn',
                    returns: PrimitiveDataType.Booleano,
                    static: true
                }
            }
        },
        [ClassesEnum.Mapa]: {
            receiver: ClassDataType.of(ClassesEnum.Mapa),
            constructs: 'Map',
            methods: {
                obtener: {
                    transpile: 'get',
                    returns: AnyDataType.Any
                },
                poner: {
                    transpile: 'set',
                    returns: ClassDataType.of(ClassesEnum.Mapa)
                },
                tiene: {
                    transpile: 'has',
                    returns: PrimitiveDataType.Booleano
                },
                borrar: {
                    transpile: 'delete',
                    returns: PrimitiveDataType.Booleano
                },
                limpiar: {
                    transpile: 'clear',
                    returns: VoidDataType.Void
                }
            },
            properties: {
                tamano: {
                    transpile: 'size',
                    returns: PrimitiveDataType.Numero
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
                    returns: ClassDataType.of(ClassesEnum.Conjunto)
                },
                tiene: {
                    transpile: 'has',
                    returns: PrimitiveDataType.Booleano
                },
                borrar: {
                    transpile: 'delete',
                    returns: PrimitiveDataType.Booleano
                },
                limpiar: {
                    transpile: 'clear',
                    returns: VoidDataType.Void
                }
            },
            properties: {
                tamano: {
                    transpile: 'size',
                    returns: PrimitiveDataType.Numero
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
                    async: true
                },
                todasResueltas: {
                    transpile: 'Promise.allSettled',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true
                },
                primera: {
                    transpile: 'Promise.race',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true
                },
                cualquiera: {
                    transpile: 'Promise.any',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true
                },
                resolver: {
                    transpile: 'Promise.resolve',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true
                },
                rechazar: {
                    transpile: 'Promise.reject',
                    returns: AnyDataType.Any,
                    static: true,
                    async: true
                }
            }
        },
        [ClassesEnum.Expresion]: {
            receiver: ClassDataType.of(ClassesEnum.Expresion),
            constructs: 'RegExp',
            methods: {
                probar: {
                    transpile: 'test',
                    returns: PrimitiveDataType.Booleano
                },
                ejecutar: {
                    transpile: 'exec',
                    returns: AnyDataType.Any
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
                    static: true
                },
                parsear: {
                    transpile: 'Date.parse',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                año: {
                    transpile: 'getFullYear',
                    returns: PrimitiveDataType.Numero
                },
                mes: {
                    transpile: 'getMonth',
                    returns: PrimitiveDataType.Numero
                },
                dia: {
                    transpile: 'getDate',
                    returns: PrimitiveDataType.Numero
                },
                diaSemana: {
                    transpile: 'getDay',
                    returns: PrimitiveDataType.Numero
                },
                hora: {
                    transpile: 'getHours',
                    returns: PrimitiveDataType.Numero
                },
                minuto: {
                    transpile: 'getMinutes',
                    returns: PrimitiveDataType.Numero
                },
                segundo: {
                    transpile: 'getSeconds',
                    returns: PrimitiveDataType.Numero
                },
                milisegundo: {
                    transpile: 'getMilliseconds',
                    returns: PrimitiveDataType.Numero
                },
                marcaDeTiempo: {
                    transpile: 'getTime',
                    returns: PrimitiveDataType.Numero
                },
                aISO: {
                    transpile: 'toISOString',
                    returns: PrimitiveDataType.Texto
                },
                aTexto: {
                    transpile: 'toString',
                    returns: PrimitiveDataType.Texto
                },
                aLocal: {
                    transpile: 'toLocaleString',
                    returns: PrimitiveDataType.Texto
                }
            }
        },
        [ClassesEnum.Aleatorio]: {
            methods: {
                elegir: {
                    transpile: 'chordElegir',
                    returns: AnyDataType.Any,
                    static: true
                },
                mezclar: {
                    transpile: 'chordMezclar',
                    returns: ArrayDataType.AnyList,
                    static: true
                },
                entre: {
                    transpile: 'chordEntre',
                    returns: PrimitiveDataType.Numero,
                    static: true
                }
            }
        }
    },
    functions: {
        esperar: 'chordEsperar'
    }
} as const satisfies CoreLib<ClassesEnum>;
