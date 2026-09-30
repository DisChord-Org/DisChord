import { CoreLib } from "./corelib.types";

/**
 * Names of the classes provided by the core library. Used as the keys of `corelib.classes`.
 */
export enum ClassesEnum {
    consola,
    Texto,
    Lista
}

/**
 * Core library definition: maps every class, and each of its methods and properties, from its
 * name in the source language to the JavaScript it is transpiled to.
 * @type {CoreLib}
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
                }
            },
            properties: {
                longitud: {
                    transpile: 'length'
                }
            }
        }
        [ClassesEnum.Mate]: {
            methods: {
                absoluto: {
                    transpile: 'Math.abs',
                    static: true
                },
                redArriba: {
                    transpile: 'Math.ceil',
                    static: true
                },
                redAbajo: {
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
                expon: {
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
                arcoSeno: {
                    transpile: 'Math.asin',
                    static: true
                },
                arcoCoseno: {
                    transpile: 'Math.acos',
                    static: true
                },
                arcoTangente: {
                    transpile: 'Math.atan',
                    static: true
                },
                arcoTangente2: {
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
                max: {
                    transpile: 'Math.max',
                    static: true
                },
                min: {
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
        }
    },
} as const satisfies CoreLib;
