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
    Objeto = 'Objeto',
    Mapa = 'Mapa',
    Conjunto = 'Conjunto',
    Promesa = 'Promesa',
    Expresion = 'Expresion',
    Fecha = 'Fecha'
}

/**
 * Core library definition: maps every class, and each of its methods and properties, from its
 * name in the source language to the JavaScript it is transpiled to. `functions` holds free
 * functions rewritten to another callee; it is empty here and left for layers built on top of
 * chord to fill.
 * @type {CoreLib<ClassesEnum>}
 */
export const corelib = {
    classes: {
        [ClassesEnum.consola]: {
            methods: {
                imprimir: {
                    transpile: 'console.log',
                    static: true
                },
                error: {
                    transpile: 'console.error',
                    static: true
                },
                advertencia: {
                    transpile: 'console.warn',
                    static: true
                },
                limpiar: {
                    transpile: 'console.clear',
                    static: true
                }
            }
        },
        [ClassesEnum.Texto]: {
            methods: {
                limpiar: {
                    transpile: 'trim'
                },
                partir: {
                    transpile: 'split'
                },
                reemplazar: {
                    transpile: 'replace'
                },
                reemplazarTodo: {
                    transpile: 'replaceAll'
                },
                terminaCon: {
                    transpile: 'endsWith'
                },
                empiezaCon: {
                    transpile: 'startsWith'
                },
                repetir: {
                    transpile: 'repeat'
                },
                cortar: {
                    transpile: 'slice'
                },
                minusculas: {
                    transpile: 'toLowerCase'
                },
                mayusculas: {
                    transpile: 'toUpperCase'
                },
                tiene: {
                    transpile: 'includes'
                },
                indiceDe: {
                    transpile: 'indexOf'
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf'
                },
                caracterEn: {
                    transpile: 'charAt'
                },
                rellenarInicio: {
                    transpile: 'padStart'
                },
                rellenarFinal: {
                    transpile: 'padEnd'
                },
                concatenar: {
                    transpile: 'concat'
                },
                recortarInicio: {
                    transpile: 'trimStart'
                },
                recortarFinal: {
                    transpile: 'trimEnd'
                },
                normalizar: {
                    transpile: 'normalize'
                },
                coincidir: {
                    transpile: 'match'
                },
                coincidirTodo: {
                    transpile: 'matchAll'
                },
                buscar: {
                    transpile: 'search'
                },
                codigoEn: {
                    transpile: 'charCodeAt'
                },
                subcadena: {
                    transpile: 'substring'
                },
                comparar: {
                    transpile: 'localeCompare'
                },
                en: {
                    transpile: 'at'
                }
            },
            properties: {
                longitud: {
                    transpile: 'length'
                }
            }
        },
        [ClassesEnum.Lista]: {
            methods: {
                agregar: {
                    transpile: 'push'
                },
                quitarUltimo: {
                    transpile: 'pop'
                },
                quitarPrimero: {
                    transpile: 'shift'
                },
                agregarInicio: {
                    transpile: 'unshift'
                },
                unir: {
                    transpile: 'join'
                },
                mapear: {
                    transpile: 'map'
                },
                llenar: {
                    transpile: 'fill'
                },
                todos: {
                    transpile: 'every'
                },
                algunos: {
                    transpile: 'some'
                },
                filtrar: {
                    transpile: 'filter'
                },
                encontrar: {
                    transpile: 'find'
                },
                tiene: {
                    transpile: 'includes'
                },
                cortar: {
                    transpile: 'slice'
                },
                invertir: {
                    transpile: 'reverse'
                },
                ordenar: {
                    transpile: 'sort'
                },
                reducir: {
                    transpile: 'reduce'
                },
                aplanar: {
                    transpile: 'flat'
                },
                paraCada: {
                    transpile: 'forEach'
                },
                indiceDe: {
                    transpile: 'indexOf'
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf'
                },
                concatenar: {
                    transpile: 'concat'
                },
                buscarIndice: {
                    transpile: 'findIndex'
                },
                encontrarUltimo: {
                    transpile: 'findLast'
                },
                aplanarMapear: {
                    transpile: 'flatMap'
                },
                en: {
                    transpile: 'at'
                },
                insertar: {
                    transpile: 'splice'
                },
                eliminar: {
                    transpile: 'splice'
                },
                claves: {
                    transpile: 'keys'
                },
                valores: {
                    transpile: 'values'
                },
                entradas: {
                    transpile: 'entries'
                },
                reducirDerecha: {
                    transpile: 'reduceRight'
                },
                copiarDentro: {
                    transpile: 'copyWithin'
                },
                ordenarCopia: {
                    transpile: 'toSorted'
                },
                invertirCopia: {
                    transpile: 'toReversed'
                }
            },
            properties: {
                longitud: {
                    transpile: 'length'
                }
            }
        },
        [ClassesEnum.Mates]: {
            methods: {
                absoluto: {
                    transpile: 'Math.abs',
                    static: true
                },
                redondearArriba: {
                    transpile: 'Math.ceil',
                    static: true
                },
                redondearAbajo: {
                    transpile: 'Math.floor',
                    static: true
                },
                redondear: {
                    transpile: 'Math.round',
                    static: true
                },
                truncar: {
                    transpile: 'Math.trunc',
                    static: true
                },
                potencia: {
                    transpile: 'Math.pow',
                    static: true
                },
                raizCuadrada: {
                    transpile: 'Math.sqrt',
                    static: true
                },
                raizCubica: {
                    transpile: 'Math.cbrt',
                    static: true
                },
                hipotenusa: {
                    transpile: 'Math.hypot',
                    static: true
                },
                exponente: {
                    transpile: 'Math.exp',
                    static: true
                },
                log: {
                    transpile: 'Math.log',
                    static: true
                },
                log10: {
                    transpile: 'Math.log10',
                    static: true
                },
                log2: {
                    transpile: 'Math.log2',
                    static: true
                },
                seno: {
                    transpile: 'Math.sin',
                    static: true
                },
                coseno: {
                    transpile: 'Math.cos',
                    static: true
                },
                tangente: {
                    transpile: 'Math.tan',
                    static: true
                },
                arcoseno: {
                    transpile: 'Math.asin',
                    static: true
                },
                arcocoseno: {
                    transpile: 'Math.acos',
                    static: true
                },
                arcotangente: {
                    transpile: 'Math.atan',
                    static: true
                },
                arcotangente2: {
                    transpile: 'Math.atan2',
                    static: true
                },
                senoHiperbolico: {
                    transpile: 'Math.sinh',
                    static: true
                },
                cosenoHiperbolico: {
                    transpile: 'Math.cosh',
                    static: true
                },
                tangenteHiperbolica: {
                    transpile: 'Math.tanh',
                    static: true
                },
                maximo: {
                    transpile: 'Math.max',
                    static: true
                },
                minimo: {
                    transpile: 'Math.min',
                    static: true
                },
                aleatorio: {
                    transpile: 'Math.random',
                    static: true
                },
                signo: {
                    transpile: 'Math.sign',
                    static: true
                },
                arcosenoHiperbolico: {
                    transpile: 'Math.asinh',
                    static: true
                },
                arcocosenoHiperbolico: {
                    transpile: 'Math.acosh',
                    static: true
                },
                arcotangenteHiperbolica: {
                    transpile: 'Math.atanh',
                    static: true
                },
                redondearFlotante: {
                    transpile: 'Math.fround',
                    static: true
                },
                exponenteMenosUno: {
                    transpile: 'Math.expm1',
                    static: true
                },
                logMasUno: {
                    transpile: 'Math.log1p',
                    static: true
                },
                ceroInicial: {
                    transpile: 'Math.clz32',
                    static: true
                }
            },
            properties: {
                PI: {
                    transpile: 'Math.PI',
                    static: true
                },
                E: {
                    transpile: 'Math.E',
                    static: true
                },
                LOGNEP2: {
                    transpile: 'Math.LN2',
                    static: true
                },
                LOGNEP10: {
                    transpile: 'Math.LN10',
                    static: true
                },
                LOG2E: {
                    transpile: 'Math.LOG2E',
                    static: true
                },
                LOG10E: {
                    transpile: 'Math.LOG10E',
                    static: true
                },
                RAIZCUADRADA1_2: {
                    transpile: 'Math.SQRT1_2',
                    static: true
                },
                RAIZCUADRADA2: {
                    transpile: 'Math.SQRT2',
                    static: true
                }
            }
        },
        [ClassesEnum.Numero]: {
            methods: {
                esEntero: {
                    transpile: 'Number.isInteger',
                    static: true
                },
                esNumero: {
                    transpile: 'Number.isFinite',
                    static: true
                },
                esEnteroSeguro: {
                    transpile: 'Number.isSafeInteger',
                    static: true
                },
                esNaN: {
                    transpile: 'Number.isNaN',
                    static: true
                },
                aEntero: {
                    transpile: 'parseInt',
                    static: true
                },
                aDecimal: {
                    transpile: 'parseFloat',
                    static: true
                },
                aFijo: {
                    transpile: 'toFixed'
                },
                aPrecision: {
                    transpile: 'toPrecision'
                },
                aTexto: {
                    transpile: 'toString'
                },
                aLocal: {
                    transpile: 'toLocaleString'
                }
            },
            properties: {
                MAXIMO_SEGURO: {
                    transpile: 'Number.MAX_SAFE_INTEGER',
                    static: true
                },
                MINIMO_SEGURO: {
                    transpile: 'Number.MIN_SAFE_INTEGER',
                    static: true
                },
                MAXIMO: {
                    transpile: 'Number.MAX_VALUE',
                    static: true
                },
                MINIMO: {
                    transpile: 'Number.MIN_VALUE',
                    static: true
                },
                EPSILON: {
                    transpile: 'Number.EPSILON',
                    static: true
                }
            }
        },
        [ClassesEnum.JSON]: {
            methods: {
                leer: {
                    transpile: 'JSON.parse',
                    static: true
                },
                escribir: {
                    transpile: 'JSON.stringify',
                    static: true
                }
            }
        },
        [ClassesEnum.Objeto]: {
            methods: {
                claves: {
                    transpile: 'Object.keys',
                    static: true
                },
                valores: {
                    transpile: 'Object.values',
                    static: true
                },
                entradas: {
                    transpile: 'Object.entries',
                    static: true
                },
                unir: {
                    transpile: 'Object.assign',
                    static: true
                },
                congelar: {
                    transpile: 'Object.freeze',
                    static: true
                },
                desdeEntradas: {
                    transpile: 'Object.fromEntries',
                    static: true
                },
                tienePropia: {
                    transpile: 'Object.hasOwn',
                    static: true
                }
            }
        },
        [ClassesEnum.Mapa]: {
            methods: {
                obtener: {
                    transpile: 'get'
                },
                poner: {
                    transpile: 'set'
                },
                existe: {
                    transpile: 'has'
                },
                borrar: {
                    transpile: 'delete'
                },
                vaciar: {
                    transpile: 'clear'
                }
            },
            properties: {
                tamano: {
                    transpile: 'size'
                }
            }
        },
        [ClassesEnum.Conjunto]: {
            methods: {
                sumar: {
                    transpile: 'add'
                }
            }
        },
        [ClassesEnum.Promesa]: {
            methods: {
                todas: {
                    transpile: 'Promise.all',
                    static: true
                },
                todasResueltas: {
                    transpile: 'Promise.allSettled',
                    static: true
                },
                primera: {
                    transpile: 'Promise.race',
                    static: true
                },
                cualquiera: {
                    transpile: 'Promise.any',
                    static: true
                },
                resolver: {
                    transpile: 'Promise.resolve',
                    static: true
                },
                rechazar: {
                    transpile: 'Promise.reject',
                    static: true
                }
            }
        },
        [ClassesEnum.Expresion]: {
            methods: {
                probar: {
                    transpile: 'test'
                },
                ejecutar: {
                    transpile: 'exec'
                }
            }
        },
        [ClassesEnum.Fecha]: {
            methods: {}
        }
    },
    functions: {}
} as const satisfies CoreLib<ClassesEnum>;
