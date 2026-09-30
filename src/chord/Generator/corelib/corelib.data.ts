import { CoreLib } from "./corelib.types";

export enum ClassesEnum {
    consola,
    Texto,
    Lista
}

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
    },
} as const satisfies CoreLib;
