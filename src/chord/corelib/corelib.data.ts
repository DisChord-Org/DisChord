import { AnyDataType, ArrayDataType, ClassDataType, PrimitiveDataType, UnionDataType, VoidDataType } from "../DataType";
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
                    returns: PrimitiveDataType.Texto
                },
                partir: {
                    transpile: 'split',
                    returns: ArrayDataType.of(PrimitiveDataType.Texto)
                },
                reemplazar: {
                    transpile: 'replace',
                    returns: PrimitiveDataType.Texto
                },
                reemplazarTodo: {
                    transpile: 'replaceAll',
                    returns: PrimitiveDataType.Texto
                },
                terminaCon: {
                    transpile: 'endsWith',
                    returns: PrimitiveDataType.Booleano
                },
                empiezaCon: {
                    transpile: 'startsWith',
                    returns: PrimitiveDataType.Booleano
                },
                repetir: {
                    transpile: 'repeat',
                    returns: PrimitiveDataType.Texto
                },
                cortar: {
                    transpile: 'slice',
                    returns: PrimitiveDataType.Texto
                },
                minusculas: {
                    transpile: 'toLowerCase',
                    returns: PrimitiveDataType.Texto
                },
                mayusculas: {
                    transpile: 'toUpperCase',
                    returns: PrimitiveDataType.Texto
                },
                tiene: {
                    transpile: 'includes',
                    returns: PrimitiveDataType.Booleano
                },
                indiceDe: {
                    transpile: 'indexOf',
                    returns: PrimitiveDataType.Numero
                },
                ultimoIndiceDe: {
                    transpile: 'lastIndexOf',
                    returns: PrimitiveDataType.Numero
                },
                caracterEn: {
                    transpile: 'charAt',
                    returns: PrimitiveDataType.Texto
                },
                rellenarInicio: {
                    transpile: 'padStart',
                    returns: PrimitiveDataType.Texto
                },
                rellenarFinal: {
                    transpile: 'padEnd',
                    returns: PrimitiveDataType.Texto
                },
                concatenar: {
                    transpile: 'concat',
                    returns: PrimitiveDataType.Texto
                },
                recortarInicio: {
                    transpile: 'trimStart',
                    returns: PrimitiveDataType.Texto
                },
                recortarFinal: {
                    transpile: 'trimEnd',
                    returns: PrimitiveDataType.Texto
                },
                normalizar: {
                    transpile: 'normalize',
                    returns: PrimitiveDataType.Texto
                },
                coincidir: {
                    transpile: 'match',
                    returns: AnyDataType.Any
                },
                coincidirTodo: {
                    transpile: 'matchAll',
                    returns: AnyDataType.Any
                },
                buscar: {
                    transpile: 'search',
                    returns: PrimitiveDataType.Numero
                },
                codigoEn: {
                    transpile: 'charCodeAt',
                    returns: PrimitiveDataType.Numero
                },
                subcadena: {
                    transpile: 'substring',
                    returns: PrimitiveDataType.Texto
                },
                comparar: {
                    transpile: 'localeCompare',
                    returns: PrimitiveDataType.Numero
                },
                en: {
                    transpile: 'at',
                    returns: UnionDataType.of([PrimitiveType.Texto, PrimitiveType.Indefinido])
                }
            },
            properties: {
                longitud: {
                    transpile: 'length',
                    returns: PrimitiveDataType.Numero
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
                    static: true
                },
                redondearArriba: {
                    transpile: 'Math.ceil',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                redondearAbajo: {
                    transpile: 'Math.floor',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                redondear: {
                    transpile: 'Math.round',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                truncar: {
                    transpile: 'Math.trunc',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                potencia: {
                    transpile: 'Math.pow',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                raizCuadrada: {
                    transpile: 'Math.sqrt',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                raizCubica: {
                    transpile: 'Math.cbrt',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                hipotenusa: {
                    transpile: 'Math.hypot',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                exponente: {
                    transpile: 'Math.exp',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                log: {
                    transpile: 'Math.log',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                log10: {
                    transpile: 'Math.log10',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                log2: {
                    transpile: 'Math.log2',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                seno: {
                    transpile: 'Math.sin',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                coseno: {
                    transpile: 'Math.cos',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                tangente: {
                    transpile: 'Math.tan',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcoseno: {
                    transpile: 'Math.asin',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcocoseno: {
                    transpile: 'Math.acos',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcotangente: {
                    transpile: 'Math.atan',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcotangente2: {
                    transpile: 'Math.atan2',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                senoHiperbolico: {
                    transpile: 'Math.sinh',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                cosenoHiperbolico: {
                    transpile: 'Math.cosh',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                tangenteHiperbolica: {
                    transpile: 'Math.tanh',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                maximo: {
                    transpile: 'Math.max',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                minimo: {
                    transpile: 'Math.min',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                aleatorio: {
                    transpile: 'Math.random',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                signo: {
                    transpile: 'Math.sign',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcosenoHiperbolico: {
                    transpile: 'Math.asinh',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcocosenoHiperbolico: {
                    transpile: 'Math.acosh',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                arcotangenteHiperbolica: {
                    transpile: 'Math.atanh',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                redondearFlotante: {
                    transpile: 'Math.fround',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                exponenteMenosUno: {
                    transpile: 'Math.expm1',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                logMasUno: {
                    transpile: 'Math.log1p',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                ceroInicial: {
                    transpile: 'Math.clz32',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                limitar: {
                    transpile: 'chordLimitar',
                    returns: PrimitiveDataType.Numero,
                    static: true
                }
            },
            properties: {
                PI: {
                    transpile: 'Math.PI',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                E: {
                    transpile: 'Math.E',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                LOGNEP2: {
                    transpile: 'Math.LN2',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                LOGNEP10: {
                    transpile: 'Math.LN10',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                LOG2E: {
                    transpile: 'Math.LOG2E',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                LOG10E: {
                    transpile: 'Math.LOG10E',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                RAIZCUADRADA1_2: {
                    transpile: 'Math.SQRT1_2',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                RAIZCUADRADA2: {
                    transpile: 'Math.SQRT2',
                    returns: PrimitiveDataType.Numero,
                    static: true
                }
            }
        },
        [ClassesEnum.Numero]: {
            receiver: PrimitiveDataType.Numero,
            methods: {
                esEntero: {
                    transpile: 'Number.isInteger',
                    returns: PrimitiveDataType.Booleano,
                    static: true
                },
                esNumero: {
                    transpile: 'Number.isFinite',
                    returns: PrimitiveDataType.Booleano,
                    static: true
                },
                esEnteroSeguro: {
                    transpile: 'Number.isSafeInteger',
                    returns: PrimitiveDataType.Booleano,
                    static: true
                },
                esNaN: {
                    transpile: 'Number.isNaN',
                    returns: PrimitiveDataType.Booleano,
                    static: true
                },
                aEntero: {
                    transpile: 'parseInt',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                aDecimal: {
                    transpile: 'parseFloat',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                aFijo: {
                    transpile: 'toFixed',
                    returns: PrimitiveDataType.Texto
                },
                aPrecision: {
                    transpile: 'toPrecision',
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
            },
            properties: {
                MAXIMO_SEGURO: {
                    transpile: 'Number.MAX_SAFE_INTEGER',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                MINIMO_SEGURO: {
                    transpile: 'Number.MIN_SAFE_INTEGER',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                MAXIMO: {
                    transpile: 'Number.MAX_VALUE',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                MINIMO: {
                    transpile: 'Number.MIN_VALUE',
                    returns: PrimitiveDataType.Numero,
                    static: true
                },
                EPSILON: {
                    transpile: 'Number.EPSILON',
                    returns: PrimitiveDataType.Numero,
                    static: true
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
                    static: true
                },
                todasResueltas: {
                    transpile: 'Promise.allSettled',
                    returns: AnyDataType.Any,
                    static: true
                },
                primera: {
                    transpile: 'Promise.race',
                    returns: AnyDataType.Any,
                    static: true
                },
                cualquiera: {
                    transpile: 'Promise.any',
                    returns: AnyDataType.Any,
                    static: true
                },
                resolver: {
                    transpile: 'Promise.resolve',
                    returns: AnyDataType.Any,
                    static: true
                },
                rechazar: {
                    transpile: 'Promise.reject',
                    returns: AnyDataType.Any,
                    static: true
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
